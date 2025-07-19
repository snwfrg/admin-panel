import { authService } from './auth'

interface FeatureFlag {
  id: string
  name: string
  enabled: boolean
  description?: string
}

interface Setting {
  id: string
  key: string
  value: string
  description?: string
}

interface Subscription {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  featureFlags: FeatureFlag[]
  settings: Setting[]
}

class SubscriptionService {
  private baseUrl = 'https://dev-api.miramedical.io/api/v4'

  private getHeaders() {
    const token = authService.getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    }
  }

  async getFeatureFlags(subscriptionId: string): Promise<FeatureFlag[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/feature-flags`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch feature flags')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch feature flags')
    }
  }

  async createFeatureFlag(subscriptionId: string, featureFlag: Omit<FeatureFlag, 'id'>): Promise<FeatureFlag> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/feature-flags`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(featureFlag),
      })

      if (!response.ok) {
        throw new Error('Failed to create feature flag')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create feature flag')
    }
  }

  async updateFeatureFlag(subscriptionId: string, flagId: string, featureFlag: Partial<FeatureFlag>): Promise<FeatureFlag> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/feature-flags/${flagId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(featureFlag),
      })

      if (!response.ok) {
        throw new Error('Failed to update feature flag')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update feature flag')
    }
  }

  async deleteFeatureFlag(subscriptionId: string, flagId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/feature-flags/${flagId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to delete feature flag')
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete feature flag')
    }
  }

  async getSettings(subscriptionId: string): Promise<Setting[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/settings`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch settings')
    }
  }

  async createSetting(subscriptionId: string, setting: Omit<Setting, 'id'>): Promise<Setting> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/settings`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(setting),
      })

      if (!response.ok) {
        throw new Error('Failed to create setting')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create setting')
    }
  }

  async getSetting(subscriptionId: string, settingId: string): Promise<Setting> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/settings/${settingId}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch setting')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch setting')
    }
  }

  async updateSetting(subscriptionId: string, settingId: string, setting: Partial<Setting>): Promise<Setting> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/settings/${settingId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(setting),
      })

      if (!response.ok) {
        throw new Error('Failed to update setting')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update setting')
    }
  }

  async deleteSetting(subscriptionId: string, settingId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/settings/${settingId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to delete setting')
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete setting')
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const [featureFlags, settings] = await Promise.all([
        this.getFeatureFlags(subscriptionId),
        this.getSettings(subscriptionId),
      ])

      return {
        id: subscriptionId,
        name: `Subscription ${subscriptionId}`,
        status: 'active',
        featureFlags,
        settings,
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch subscription')
    }
  }

  getMockSubscriptions(): Subscription[] {
    return [
      {
        id: 'sub-001',
        name: 'Premium Plan',
        status: 'active',
        featureFlags: [],
        settings: [],
      },
      {
        id: 'sub-002', 
        name: 'Basic Plan',
        status: 'active',
        featureFlags: [],
        settings: [],
      },
      {
        id: 'sub-003',
        name: 'Enterprise Plan',
        status: 'inactive',
        featureFlags: [],
        settings: [],
      },
    ]
  }
}

export const subscriptionService = new SubscriptionService()
export type { Subscription, FeatureFlag, Setting }