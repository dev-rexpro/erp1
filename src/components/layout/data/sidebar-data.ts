import {
  Construction,
  LayoutDashboard,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Package,
  ServerOff,
  Settings,
  UserX,
  Users,
  MessagesSquare,
  AudioWaveform,
  GalleryVerticalEnd,
  Briefcase,
  ShieldAlert,
  Truck,
  ShoppingBag,
  DollarSign,
  Folder,
  Brain,
  MoreHorizontal,
  Gauge,
} from 'lucide-react'
import React from 'react'
import { type SidebarData } from '../types'

const ERPOneLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
  React.createElement('img', {
    src: '/o1_logo.png',
    alt: 'ERP One Logo',
    className: props.className + ' object-contain size-5 shrink-0',
  })

export const sidebarData: SidebarData = {
  user: {
    name: 'Fadhlur Rahman',
    email: 'fdrahman@rexcorp.id',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'ERP One',
      logo: ERPOneLogo,
      plan: 'Rexcorp Global Trade',
    },
    {
      name: 'ERP One',
      logo: GalleryVerticalEnd,
      plan: 'rexpro-devops',
    },
    {
      name: 'ERP One',
      logo: AudioWaveform,
      plan: 'Omniverse One',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Commercial',
          icon: Briefcase,
          items: [
            {
              title: 'Client Accounts',
              url: '/commercial/client-accounts',
            },
            {
              title: 'Service Quotations',
              url: '/commercial/service-quotations',
            },
            {
              title: 'Client Contracts',
              url: '/commercial/client-contracts',
            },
          ],
        },
        {
          title: 'Compliance',
          icon: ShieldAlert,
          items: [
            {
              title: 'Customs Declarations',
              url: '/compliance/customs-declarations',
            },
            {
              title: 'Trade Licenses',
              url: '/compliance/trade-licenses',
            },
            {
              title: 'Duty Tariffs',
              url: '/compliance/duty-tariffs',
            },
          ],
        },
        {
          title: 'Logistics',
          icon: Truck,
          items: [
            {
              title: 'Shipments',
              url: '/logistics/shipments',
            },
            {
              title: 'Shipping Instructions',
              url: '/logistics/shipping-instructions',
            },
            {
              title: 'Packing List',
              url: '/logistics/packing-list',
            },
            {
              title: 'Cargo Tracking',
              url: '/logistics/cargo-tracking',
            },
            {
              title: 'DnD Fee',
              url: '/logistics/dnd-fee',
            },
          ],
        },
        {
          title: 'Procurement',
          icon: ShoppingBag,
          items: [
            {
              title: 'Partner Directory',
              url: '/procurement/partner-directory',
            },
            {
              title: 'Vendor Rates',
              url: '/procurement/vendor-rates',
            },
            {
              title: 'Purchase Orders',
              url: '/procurement/purchase-orders',
            },
          ],
        },
        {
          title: 'Finance',
          icon: DollarSign,
          items: [
            {
              title: 'Overview',
              url: '/finance/overview',
            },
            {
              title: 'Client Invoices',
              url: '/finance/client-invoices',
            },
            {
              title: 'Accounts Receivable',
              url: '/finance/accounts-receivable',
            },
            {
              title: 'Cost Accruals',
              url: '/finance/cost-accruals',
            },
            {
              title: 'Vendor Bills',
              url: '/finance/vendor-bills',
            },
            {
              title: 'General Ledger',
              url: '/finance/general-ledger',
            },
          ],
        },
        {
          title: 'Document Hub',
          url: '/document-hub',
          icon: Folder,
        },
        {
          title: 'System Intelligence',
          url: '/system-intelligence',
          icon: Brain,
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: Gauge,
        },
        {
          title: 'Productivity',
          url: '/productivity',
          icon: ListTodo,
        },
        {
          title: 'System Settings',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Others',
          icon: MoreHorizontal,
          items: [
            {
              title: 'Tasks',
              url: '/tasks',
              icon: ListTodo,
            },
            {
              title: 'Apps',
              url: '/apps',
              icon: Package,
            },
            {
              title: 'Chats',
              url: '/chats',
              badge: '3',
              icon: MessagesSquare,
            },
            {
              title: 'Users',
              url: '/users',
              icon: Users,
            },
            {
              title: 'Help Center',
              url: '/help-center',
              icon: HelpCircle,
            },
            {
              title: 'Secured by Clerk: Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Secured by Clerk: Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'Secured by Clerk: User Management',
              url: '/clerk/user-management',
            },
            {
              title: 'Auth: Sign In',
              url: '/sign-in',
            },
            {
              title: 'Auth: Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Auth: Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Auth: Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'Auth: OTP',
              url: '/otp',
            },
            {
              title: 'Error: Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Error: Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Error: Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Error: Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Error: Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
  ],
}
