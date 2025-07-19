interface LoginResponse {
  token?: string
  user?: {
    id: string
    email: string
    name?: string
  }
}

class AuthService {
  private baseUrl = 'https://dev-api.miramedical.io/api/v4'

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      
      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }

      return data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed')
    }
  }

  logout(): void {
    localStorage.removeItem('authToken')
  }

  getToken(): string | null {
    return localStorage.getItem('authToken')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()