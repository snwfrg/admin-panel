import { useState, useEffect } from 'react'
import { subscriptionService, type Subscription, type FeatureFlag, type Setting } from '../services/subscriptions'

interface SubscriptionDetailProps {
  subscription: Subscription
  onBack: () => void
}

export default function SubscriptionDetail({ subscription, onBack }: SubscriptionDetailProps) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'flags' | 'settings'>('flags')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', value: '', description: '' })

  useEffect(() => {
    loadSubscriptionData()
  }, [subscription.id])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      const [flags, setts] = await Promise.all([
        subscriptionService.getFeatureFlags(subscription.id),
        subscriptionService.getSettings(subscription.id),
      ])
      setFeatureFlags(flags)
      setSettings(setts)
    } catch (error) {
      console.error('Failed to load subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatureFlag = async (flag: FeatureFlag) => {
    try {
      await subscriptionService.updateFeatureFlag(subscription.id, flag.id, {
        enabled: !flag.enabled
      })
      setFeatureFlags(flags => 
        flags.map(f => f.id === flag.id ? { ...f, enabled: !f.enabled } : f)
      )
    } catch (error) {
      console.error('Failed to toggle feature flag:', error)
    }
  }

  const handleDeleteFeatureFlag = async (flagId: string) => {
    try {
      await subscriptionService.deleteFeatureFlag(subscription.id, flagId)
      setFeatureFlags(flags => flags.filter(f => f.id !== flagId))
    } catch (error) {
      console.error('Failed to delete feature flag:', error)
    }
  }

  const handleDeleteSetting = async (settingId: string) => {
    try {
      await subscriptionService.deleteSetting(subscription.id, settingId)
      setSettings(setts => setts.filter(s => s.id !== settingId))
    } catch (error) {
      console.error('Failed to delete setting:', error)
    }
  }

  const handleAddItem = async () => {
    try {
      if (activeTab === 'flags') {
        const newFlag = await subscriptionService.createFeatureFlag(subscription.id, {
          name: newItem.name,
          enabled: false,
          description: newItem.description,
        })
        setFeatureFlags(flags => [...flags, newFlag])
      } else {
        const newSetting = await subscriptionService.createSetting(subscription.id, {
          key: newItem.name,
          value: newItem.value,
          description: newItem.description,
        })
        setSettings(setts => [...setts, newSetting])
      }
      setNewItem({ name: '', value: '', description: '' })
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to add item:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{subscription.name}</h2>
              <p className="text-gray-600 text-sm">ID: {subscription.id}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
            subscription.status === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {subscription.status}
          </span>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('flags')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'flags'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Feature Flags ({featureFlags.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'settings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings ({settings.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {activeTab === 'flags' ? 'Feature Flags' : 'Settings'}
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add {activeTab === 'flags' ? 'Feature Flag' : 'Setting'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === 'flags' ? (
              featureFlags.length > 0 ? (
                featureFlags.map((flag) => (
                  <div key={flag.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{flag.name}</h4>
                        {flag.description && (
                          <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleFeatureFlag(flag)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            flag.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              flag.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteFeatureFlag(flag.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No feature flags configured
                </div>
              )
            ) : (
              settings.length > 0 ? (
                settings.map((setting) => (
                  <div key={setting.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{setting.key}</h4>
                        <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                          {setting.value}
                        </p>
                        {setting.description && (
                          <p className="text-sm text-gray-600 mt-2">{setting.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSetting(setting.id)}
                        className="text-red-600 hover:text-red-800 ml-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No settings configured
                </div>
              )
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add {activeTab === 'flags' ? 'Feature Flag' : 'Setting'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'flags' ? 'Name' : 'Key'}
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {activeTab === 'settings' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="text"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}