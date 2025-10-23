'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Check, Clock, ExternalLink, RefreshCw, Lock, Copy } from 'lucide-react'

// Admin emails - ONLY these emails can access admin panel
const ADMIN_EMAILS = [
  'govardhanbommineni@gmail.com', // Your email
  // Add more admin emails here
]

interface Payment {
  id: string
  user_id: string
  amount: number
  status: string
  order_id: string
  transaction_id?: string
  created_at: string
  user: {
    email: string
  }
  subscription: {
    is_active: boolean
  }
}

export default function AdminPaymentsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '')

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/dashboard')
    }
  }, [user, authLoading, isAdmin, router])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/admin/payments', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const activateUser = async (userId: string, paymentId: string) => {
    if (!confirm('Are you sure you want to activate this user?')) {
      return
    }

    setActivating(paymentId)
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/admin/activate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ userId, paymentId }),
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ User activated successfully!')
        fetchPayments() // Refresh list
      } else {
        alert('❌ Failed to activate: ' + data.error)
      }
    } catch (error) {
      console.error('Error activating user:', error)
      alert('❌ Failed to activate user')
    } finally {
      setActivating(null)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-lg shadow-lg p-12 max-w-md">
          <Lock size={64} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access the admin panel.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    )
  }

  const pendingPayments = payments.filter(p => p.status === 'pending' && !p.subscription?.is_active)
  const activatedUsers = payments.filter(p => p.subscription?.is_active)
  const failedPayments = payments.filter(p => p.status === 'failed')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-1">Manage user payments and activations</p>
          </div>
          <Button onClick={fetchPayments} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Activation</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingPayments.length}</p>
              </div>
              <Clock className="text-yellow-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activated Users</p>
                <p className="text-3xl font-bold text-green-600">{activatedUsers.length}</p>
              </div>
              <Check className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-primary-600">
                  ₹{(activatedUsers.length * 54).toLocaleString()}
                </p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Pending Payments Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Payments ({pendingPayments.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Check Instamojo dashboard and activate users who have paid
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingPayments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No pending payments</p>
              </div>
            ) : (
              pendingPayments.map((payment) => (
                <div key={payment.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900">{payment.user.email}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Order ID: {payment.order_id}</span>
                          <span>•</span>
                          <span>Amount: ₹{payment.amount}</span>
                          <span>•</span>
                          <span>{getTimeAgo(payment.created_at)}</span>
                        </div>
                        {payment.transaction_id && (
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-1 w-fit">
                            <span className="text-xs font-semibold text-green-800">UTR:</span>
                            <span className="text-sm font-mono text-green-900">{payment.transaction_id}</span>
                            <button
                              onClick={() => payment.transaction_id && navigator.clipboard.writeText(payment.transaction_id)}
                              className="text-green-700 hover:text-green-900"
                              title="Copy UTR"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href="https://www.instamojo.com/dashboard/payments/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        Check Instamojo
                        <ExternalLink size={14} />
                      </a>
                      
                      <Button
                        onClick={() => activateUser(payment.user_id, payment.id)}
                        disabled={activating === payment.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {activating === payment.id ? 'Activating...' : 'Activate User'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activated Users Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Activated Users ({activatedUsers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {activatedUsers.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <Check size={48} className="mx-auto mb-4 opacity-50" />
                <p>No activated users yet</p>
              </div>
            ) : (
              activatedUsers.map((payment) => (
                <div key={payment.id} className="px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.user.email}</p>
                      <p className="text-sm text-gray-600">{getTimeAgo(payment.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">
                        <Check size={20} />
                      </span>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
