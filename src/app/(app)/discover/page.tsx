
import { DiscoveryForm } from './discovery-form';

export const metadata = {
  title: 'Discover Games | ASTRA',
  description: 'Let our AI find your next favorite game based on your history and preferences.',
};

export default function DiscoverPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">AI Game Discovery</h1>
        <p className="text-muted-foreground">
          Unearth your next obsession. Tell our AI what you like, and we&apos;ll do the rest.
        </p>
      </div>
      <DiscoveryForm />
    </div>
  );
}
