# Contributing to Handwriting PDF Generator

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check if the feature is already requested
2. Create an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach
   - Mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/handwriting-pdf.git
   cd handwriting-pdf
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Follow the code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run dev
   npm run build
   npm run type-check
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a Pull Request on GitHub.

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup Steps

1. Clone and install
   ```bash
   git clone <repo-url>
   cd handwriting-pdf
   npm install
   ```

2. Set up environment variables
   ```bash
   cp .env.local.example .env.local
   # Fill in your credentials
   ```

3. Run development server
   ```bash
   npm run dev
   ```

4. Access at http://localhost:3000

## Code Style

### TypeScript

- Use TypeScript for all new files
- Enable strict mode
- Define proper types (avoid `any`)
- Use interfaces for component props

```typescript
// Good
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export const Button = ({ onClick, children }: ButtonProps) => {
  // component code
}

// Bad
export const Button = ({ onClick, children }: any) => {
  // component code
}
```

### React Components

- Use functional components
- Use hooks (useState, useEffect, etc.)
- Extract custom hooks for reusable logic
- Keep components small and focused

```typescript
// Good - Small, focused component
export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <img src={user.avatar} alt={user.name} />
  )
}

// Bad - Too many responsibilities
export const UserProfile = ({ user }) => {
  // 200 lines of code...
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Utilities: `kebab-case.ts` (e.g., `font-validator.ts`)
- Types: `kebab-case.ts` (e.g., `database.ts`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useAuth.ts`)

### Imports

- Use absolute imports with `@/`
- Group imports logically

```typescript
// External dependencies first
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

// Internal imports
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'

// Types
import type { User } from '@/types/database'
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use `cn()` helper for conditional classes

```typescript
import { cn } from '@/lib/utils'

<button
  className={cn(
    'px-4 py-2 rounded',
    isActive && 'bg-blue-500',
    isDisabled && 'opacity-50'
  )}
>
  Click me
</button>
```

## Testing

### Manual Testing

Before submitting PR, test:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Works on Chrome, Firefox, Safari
- [ ] Works on mobile
- [ ] Existing features still work

### Adding Tests (Future)

When we add automated tests:
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Documentation

### Code Comments

- Add comments for complex logic
- Use JSDoc for functions
- Explain WHY, not WHAT

```typescript
/**
 * Validates a font file by checking its magic number
 * @param buffer - Font file buffer
 * @returns Validation result with format
 */
export const validateFontBuffer = (buffer: Buffer): FontValidation => {
  // TTF files start with 0x00010000
  const isTTF = buffer[0] === 0x00 && buffer[1] === 0x01
  
  // OTF files start with "OTTO"
  const isOTF = buffer[0] === 0x4F && buffer[1] === 0x54
  
  return {
    isValid: isTTF || isOTF,
    format: isTTF ? 'ttf' : 'otf'
  }
}
```

### Documentation Files

Update relevant docs when:
- Adding new features
- Changing setup process
- Fixing bugs
- Changing APIs

## Project Structure

```
app/
├── api/           # API routes
├── auth/          # Auth pages
├── dashboard/     # Dashboard
├── fonts/         # Font management
├── projects/      # Projects
└── page.tsx       # Home page

components/
├── auth/          # Auth components
├── editor/        # Editor components
├── fonts/         # Font components
├── layout/        # Layout components
├── project/       # Project components
└── ui/            # Reusable UI

lib/
├── supabase.ts    # Database client
├── cloudinary.ts  # Storage client
└── utils.ts       # Helpers

types/             # TypeScript types
hooks/             # Custom hooks
```

## Areas for Contribution

### High Priority

- [ ] Better PDF text detection algorithm
- [ ] Mobile app responsiveness improvements
- [ ] Performance optimizations
- [ ] Error handling improvements
- [ ] User experience enhancements

### Medium Priority

- [ ] Add automated tests
- [ ] Improve accessibility (a11y)
- [ ] Add internationalization (i18n)
- [ ] Add analytics
- [ ] Add rate limiting

### Low Priority

- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Advanced editor features
- [ ] Export/import projects
- [ ] Template system

### Good First Issues

Looking for your first contribution? Try:
- Improve error messages
- Add loading states
- Fix typos in documentation
- Improve UI on mobile
- Add helpful tooltips

## API Design

When adding new API routes:

1. Use proper HTTP methods
   - GET: Fetch data
   - POST: Create data
   - PATCH: Update data
   - DELETE: Remove data

2. Return consistent responses
   ```typescript
   // Success
   return NextResponse.json({
     success: true,
     data: result
   })
   
   // Error
   return NextResponse.json({
     success: false,
     error: 'Error message'
   }, { status: 400 })
   ```

3. Validate input
4. Handle errors properly
5. Add logging for debugging

## Database Changes

When modifying database:

1. Update schema in `database/schema.sql`
2. Update TypeScript types in `types/database.ts`
3. Test locally before deploying
4. Document breaking changes
5. Consider migration path

## Security

When contributing:

- Never commit secrets or API keys
- Validate all user input
- Use parameterized queries
- Follow RLS policies
- Test authentication flows
- Check for XSS vulnerabilities
- Verify file uploads

## Performance

Consider performance:

- Lazy load heavy components
- Optimize images
- Minimize API calls
- Use caching where appropriate
- Profile before optimizing

## Questions?

- Open an issue for questions
- Join discussions
- Ask in pull requests
- Check documentation first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
