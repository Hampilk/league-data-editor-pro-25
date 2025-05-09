
# Components Documentation

This directory contains documentation for the UI components used in the Football League Analytics platform.

## Component Categories

- [Analysis Components](./analysis.md)
- [League Components](./league.md)
- [Match Components](./matches.md)
- [Prediction Components](./prediction.md)
- [UI Components](./ui.md)

## Component Standards

All components should follow these standards:

1. **Props Interface**: All components should have a clearly defined props interface
2. **Documentation**: Components should be documented with JSDoc comments
3. **Accessibility**: Components should meet WCAG 2.1 AA standards
4. **Responsive Design**: Components should work on all screen sizes
5. **Error Handling**: Components should gracefully handle error states

## Example Component

```tsx
import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component with different variants and sizes
 * 
 * @param props - Button props
 * @returns A styled button element
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base styles
        "rounded font-medium",
        // Variant styles
        variant === 'primary' && "bg-blue-500 text-white",
        variant === 'secondary' && "bg-gray-200 text-gray-800",
        variant === 'outline' && "border border-gray-300 text-gray-800",
        // Size styles
        size === 'sm' && "px-2 py-1 text-sm",
        size === 'md' && "px-4 py-2",
        size === 'lg' && "px-6 py-3 text-lg",
        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Testing Components

Each component should have corresponding tests that cover:

1. **Rendering**: Does the component render correctly with different props?
2. **Interactions**: Do user interactions (clicks, inputs, etc.) work as expected?
3. **Edge Cases**: How does the component handle edge cases (empty data, errors, etc.)?
