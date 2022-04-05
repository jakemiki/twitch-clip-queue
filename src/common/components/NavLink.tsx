import React from 'react';
import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom';

const NavLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<NavLinkProps, 'className' | 'type' | 'style'> & { activeStyle?: NavLinkProps['style'] }
>(({ activeStyle, ...props }, ref) => <NavLinkBase ref={ref} {...props} style={activeStyle} />);

export default NavLink;
