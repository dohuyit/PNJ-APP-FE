import { useBoolean } from 'minimal-shared/hooks';
import { useRef, useEffect, useCallback } from 'react';
import { isActiveLink, isExternalLink } from 'minimal-shared/utils';

import { usePathname } from 'src/routes/hooks';

import { NavItem } from './nav-item';
import { navSectionClasses } from '../styles';
import { NavUl, NavLi, NavCollapse } from '../components';
const hasPermission = () => true;
const enablePermission = () => false;

// ----------------------------------------------------------------------

export function NavList({ data, depth, render, slotProps, currentRole, permissions, enabledRootRedirect }) {
  const pathname = usePathname();
  const navItemRef = useRef(null);

  const isActive = isActiveLink(pathname, data.path, !!data.children);

  const { value: open, onFalse: onClose, onToggle } = useBoolean(isActive);

  useEffect(() => {
    if (!isActive) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      onToggle();
    }
  }, [data.children, onToggle]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      open={open}
      active={isActive}
      disabled={data.disabled}
      // options
      depth={depth}
      render={render}
      hasChild={!!data.children}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onClick={handleToggleMenu}
    />
  );

  const renderCollapse = () => !!data.children && (
          <NavCollapse mountOnEnter unmountOnExit depth={depth} in={open} data-group={data.title}>
              <NavSubList
                  data={data.children}
                  render={render}
                  depth={depth}
                  slotProps={slotProps}
                  currentRole={currentRole}
                  permissions={permissions}
                  enabledRootRedirect={enabledRootRedirect}
              />
          </NavCollapse>
      )

  // Hidden item by role
  if (data.roles && currentRole && !data.roles.includes(currentRole)) {
    return null;
  }

    if (data.children) {
        if (!isShowParentMenu(data.children)) {
            return null;
        }
    } else {
        const codes = permissions || data.permissions
        const isNotGranted = codes && !hasPermission(codes);
        // Hidden item by permissions
        if (isNotGranted) {
            return null;
        }
    }

  return (
    <NavLi
      disabled={data.disabled}
      sx={{
        ...(!!data.children && {
          [`& .${navSectionClasses.li}`]: { '&:first-of-type': { mt: 'var(--nav-item-gap)' } },
        }),
      }}
    >
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  );
}

const isShowParentMenu = (items = []) => {
    if (!enablePermission()) {
        return true
    }
    for (let i in items) {
        const item = items[i];
        // has no children & no permission
        if (!item.children && !item.permissions) {
            return true
        }
        // has children & permission
        if (item.children && isShowParentMenu(item.children)) {
            return true
        }
        if (item.permissions && item.permissions.length && hasPermission(item.permissions)) {
            return true
        }
    }
    return false
}

// ----------------------------------------------------------------------

function NavSubList({ data, render, depth = 0, slotProps, currentRole, enabledRootRedirect }) {
  return (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          currentRole={currentRole}
          permissions={list.permissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
