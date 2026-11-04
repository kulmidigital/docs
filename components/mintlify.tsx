/**
 * Components the content was written against on Mintlify that have no direct
 * Fumadocs equivalent, so the MDX can keep using them unchanged.
 */
import { Card as FumaCard } from 'fumadocs-ui/components/card';
import { Step as FumaStep, Steps as FumaSteps } from 'fumadocs-ui/components/steps';
import {
  AppWindow,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Banknote,
  Bell,
  Code,
  FlaskConical,
  KeyRound,
  Landmark,
  List,
  type LucideIcon,
  Plus,
  Rocket,
  Search,
  Settings,
  ShoppingCart,
  Smartphone,
  Store,
  Wallet,
  Webhook,
} from 'lucide-react';
import type { ReactNode } from 'react';

// Mintlify icon names (Font Awesome) mapped to Lucide.
const icons: Record<string, LucideIcon> = {
  'arrow-down-to-line': ArrowDownToLine,
  'arrow-up-from-line': ArrowUpFromLine,
  'arrows-right-left': ArrowLeftRight,
  bell: Bell,
  'building-columns': Landmark,
  'building-storefront': Store,
  'cart-shopping': ShoppingCart,
  code: Code,
  flask: FlaskConical,
  gear: Settings,
  key: KeyRound,
  list: List,
  'magnifying-glass': Search,
  mobile: Smartphone,
  'money-bill-transfer': Banknote,
  plus: Plus,
  rocket: Rocket,
  'shopping-cart': ShoppingCart,
  wallet: Wallet,
  webhook: Webhook,
  window: AppWindow,
};

export function Card({
  icon,
  title,
  href,
  children,
}: {
  icon?: string;
  title: string;
  href?: string;
  children?: ReactNode;
}) {
  const Icon = icon ? icons[icon] : undefined;
  if (icon && !Icon) throw new Error(`Unknown card icon "${icon}". Add it to components/mintlify.tsx.`);

  return (
    <FumaCard title={title} href={href} icon={Icon ? <Icon /> : undefined}>
      {children}
    </FumaCard>
  );
}

const columns: Record<number, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export function CardGroup({ cols = 2, children }: { cols?: number; children: ReactNode }) {
  return <div className={`kp-cards grid grid-cols-1 gap-3 ${columns[cols] ?? ''}`}>{children}</div>;
}

export function Steps({ children }: { children: ReactNode }) {
  return <FumaSteps>{children}</FumaSteps>;
}

export function Step({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <FumaStep>
      {title ? <p className="kp-step-title">{title}</p> : null}
      {children}
    </FumaStep>
  );
}

function Field({
  name,
  type,
  location,
  required,
  defaultValue,
  deprecated,
  children,
}: {
  name?: string;
  type?: string;
  location?: string;
  required?: boolean;
  defaultValue?: unknown;
  deprecated?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="kp-field">
      <div className="kp-field-head">
        <span className="kp-field-name">{name}</span>
        {type ? <span className="kp-field-meta">{type}</span> : null}
        {location ? <span className="kp-field-meta">{location}</span> : null}
        {defaultValue !== undefined ? (
          <span className="kp-field-meta">default: {String(defaultValue)}</span>
        ) : null}
        {required ? <span className="kp-field-required">required</span> : null}
        {deprecated ? <span className="kp-field-meta">deprecated</span> : null}
      </div>
      {children ? <div className="kp-field-body">{children}</div> : null}
    </div>
  );
}

interface FieldProps {
  type?: string;
  required?: boolean;
  default?: unknown;
  deprecated?: boolean;
  children?: ReactNode;
}

export function ParamField({
  body,
  query,
  path,
  header,
  default: defaultValue,
  ...props
}: FieldProps & { body?: string; query?: string; path?: string; header?: string }) {
  const location = query ? 'query' : path ? 'path' : header ? 'header' : undefined;

  return (
    <Field name={body ?? query ?? path ?? header} location={location} defaultValue={defaultValue} {...props} />
  );
}

export function ResponseField({
  name,
  default: defaultValue,
  ...props
}: FieldProps & { name: string }) {
  return <Field name={name} defaultValue={defaultValue} {...props} />;
}

export function Expandable({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <details className="kp-expandable">
      <summary>
        <span className="kp-when-closed">Show {title}</span>
        <span className="kp-when-open">Hide {title}</span>
      </summary>
      <div className="kp-expandable-body">{children}</div>
    </details>
  );
}
