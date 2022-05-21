import * as React from 'react';
import { useRouter } from 'next/router';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import ROUTES from 'src/route';
import Link from 'src/components/Link';

const Navigation = styled('nav')(({ theme }) => ({
  '& ul': {
    padding: 0,
    margin: 0,
    listStyle: 'none',
    display: 'flex',
  },
  '& li': {
    color: theme.palette.text.primary,
    ...theme.typography.body2,
    fontWeight: 700,
    '& > a, & > div': {
      display: 'inline-block',
      color: 'inherit',
      textDecoration: 'none',
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      '&:hover, &:focus': {
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background : theme.palette.grey[50],
        color:
          theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[700],
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'initial',
        },
      },
    },
    '& > div': {
      cursor: 'default',
    },
  },
}));

const PRODUCT_IDS = ['product-core', 'product-advanced', 'product-templates', 'product-design'];

type ProductSubMenuProps = {
  icon: React.ReactElement;
  name: React.ReactNode;
  description: React.ReactNode;
  href: string;
} & Omit<JSX.IntrinsicElements['a'], 'ref'>;

const ProductSubMenu = React.forwardRef<HTMLAnchorElement, ProductSubMenuProps>(
  function ProductSubMenu({ icon, name, description, href, ...props }, ref) {
    return (
      <Box
        component={Link}
        href={href}
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 2,
          '&:hover, &:focus': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'primaryDark.700' : 'grey.50',
            outline: 'none',
            '@media (hover: none)': {
              backgroundColor: 'initial',
              outline: 'initial',
            },
          },
        }}
        {...props}
      >
        <Box
          sx={{
            px: 2,
            '& circle': {
              fill: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[100],
            },
          }}
        >
          {icon}
        </Box>
        <div>
          <Typography color="text.primary" variant="body2" fontWeight={700}>
            {name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        </div>
      </Box>
    );
  },
);

function getNextIndex(eventKey: KeyboardEvent['key'], currentIndex: number, length: number) {
  if (eventKey === 'ArrowLeft') {
    return currentIndex === 0 ? length - 1 : currentIndex - 1;
  }
  if (eventKey === 'ArrowRight') {
    return currentIndex === length - 1 ? 0 : currentIndex + 1;
  }
  return currentIndex;
}

export default function HeaderNavBar() {
  const router = useRouter();
  const asPathWithoutLang = router.asPath.replace(/^\/[a-zA-Z]{2}\//, '/');
  const [subMenuOpen, setSubMenuOpen] = React.useState(false);
  const [subMenuIndex, setSubMenuIndex] = React.useState<number | null>(null);
  const navRef = React.useRef<HTMLUListElement | null>(null);
  const productsMenuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (typeof subMenuIndex === 'number') {
      document.getElementById(PRODUCT_IDS[subMenuIndex])?.focus();
    }
  }, [subMenuIndex]);
  function handleLeftRightArrow(
    event: React.KeyboardEvent,
    target: EventTarget | HTMLElement | null = event.target,
  ) {
    if (navRef.current) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        let i = 0;
        while (i < navRef.current.children.length) {
          const child = navRef.current.children.item(i);
          if (child && (target === child || child.contains(target as Node))) {
            const prevSibling = navRef.current.children.item(
              getNextIndex(event.key, i, navRef.current.children.length),
            );
            const htmlElement = prevSibling ? (prevSibling.firstChild as HTMLElement) : null;
            if (htmlElement) {
              htmlElement.focus();
            }
          }
          i += 1;
        }
      }
    }
  }
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      handleLeftRightArrow(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }) as unknown as React.KeyboardEvent,
        productsMenuRef.current?.parentElement,
      );
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      handleLeftRightArrow(event, productsMenuRef.current?.parentElement);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (event.target === productsMenuRef.current) {
        setSubMenuOpen(true);
      }
      setSubMenuIndex((prevValue) => {
        if (prevValue === null) {
          return 0;
        }
        if (prevValue === PRODUCT_IDS.length - 1) {
          return 0;
        }
        return prevValue + 1;
      });
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSubMenuIndex((prevValue) => {
        if (prevValue === null) {
          return 0;
        }
        if (prevValue === 0) {
          return PRODUCT_IDS.length - 1;
        }
        return prevValue - 1;
      });
    }
    if (event.key === 'Escape') {
      setSubMenuOpen(false);
      setSubMenuIndex(null);
    }
  }
  return (
    <Navigation>
      <ul ref={navRef} role="menubar" onKeyDown={handleLeftRightArrow}>
        <li role="none">
          <Link
            role="menuitem"
            href={
              ROUTES.workspace
            }
          >
           Workspace 
          </Link>
        </li>
        <li role="none">
          <Link role="menuitem" href={ROUTES.projectManage}>
            Project Manage
          </Link>
        </li>
        <li role="none">
          <Link role="menuitem" href={ROUTES.itJournal}>
            IT Journal
          </Link>
        </li>
        <li role="none">
          <Link role="menuitem" href={ROUTES.fbcash}>
            Fbcash
          </Link>
        </li>
        <li role="none">
          <Link role="menuitem" href={ROUTES.board}>
            Board
          </Link>
        </li>
        <li role="none">
          <Link role="menuitem" href={ROUTES.template}>
            Template
          </Link>
        </li>
      </ul>
    </Navigation>
  );
}
