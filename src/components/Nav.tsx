import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef, type ComponentProps } from "react";

interface NavLinkCompatProps extends Omit<ComponentProps<typeof RouterNavLink>, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        {...props} 
        className={({ isActive, isPending }) =>
          [
            className,
            isActive ? activeClassName : undefined,
            isPending ? pendingClassName : undefined,
          ]
            .filter(Boolean)
            .join(" ")
        }
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };