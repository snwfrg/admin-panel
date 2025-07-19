import { useState } from 'react'
import SubscriptionsList from '../components/SubscriptionsList'
import SubscriptionDetail from '../components/SubscriptionDetail'
import { type Subscription } from '../services/subscriptions'

export default function SubscriptionsPage() {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  const handleSelectSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
  }

  const handleBack = () => {
    setSelectedSubscription(null)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {selectedSubscription ? (
          <SubscriptionDetail
            subscription={selectedSubscription}
            onBack={handleBack}
          />
        ) : (
          <SubscriptionsList onSelectSubscription={handleSelectSubscription} />
        )}
      </div>
    </div>
  )
}