const ERROR_CODE_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS:    'Invalid username or password.',
  UNAUTHORIZED:           'You must be logged in to perform this action.',
  FORBIDDEN:              'You do not have permission to perform this action.',

  USER_NOT_FOUND:               'User not found.',
  AGENCY_NOT_FOUND:             'Agency not found.',
  ADMIN_USER_NOT_FOUND:         'Admin user not found.',
  PROPERTY_NOT_FOUND:           'Property not found.',
  AGENCY_PROPERTY_NOT_FOUND:    'Listing not found.',
  FAVORITE_NOT_FOUND:           'Favorite not found.',

  USERNAME_ALREADY_EXISTS:              'That username is already taken.',
  EMAIL_ALREADY_EXISTS:                 'That email address is already registered.',
  PUBLICATION_ALREADY_FAVORITED:        'This property is already in your favorites.',
  PUBLICATION_ALREADY_EXISTS_FOR_AGENCY:'This property is already listed by your agency.',

  PROPERTY_ALREADY_SOLD:                'This property has already been sold.',
  CANNOT_MODIFY_OTHER_PUBLICATION:      'You can only edit your own listings.',
  CANNOT_DELETE_OTHER_PUBLICATION:      'You can only delete your own listings.',
  SOLD_PUBLICATION_CANNOT_BE_DELETED:   'A sold listing cannot be deleted.',
  SOLD_PROPERTY_CANNOT_BE_DELETED:      'A sold property cannot be deleted.',
  PROPERTY_HAS_ACTIVE_PUBLICATIONS:     'This property still has active listings and cannot be deleted.',

  CANNOT_MODIFY_OTHER_FAVORITE:   'You can only edit your own favorites.',
  CANNOT_DELETE_OTHER_FAVORITE:   'You can only delete your own favorites.',

  INVALID_PROPERTY_TYPE:  'The selected property type is not valid.',
  INVALID_PRICE_RANGE:    'The price range is invalid. Min price must be less than or equal to max price.',
  INVALID_ROOMS:          'The room range is invalid. Both values must be greater than zero and min must not exceed max.',
  INVALID_SCORE:          'The score must be a value between 1 and 5.',
  INVALID_REQUEST:        'The request contains invalid data. Please review your input.',

  INTERNAL_ERROR:         'An unexpected server error occurred. Please try again later.',
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init)
  if (!res.ok) {
    let message: string
    try {
      const body = await res.json()
      const code: string | undefined = body?.code
      message = (code && ERROR_CODE_MESSAGES[code]) ?? body?.message ?? fallbackMessage(res.status)
    } catch {
      message = fallbackMessage(res.status)
    }
    throw new ApiError(message, res.status)
  }
  return res
}

function fallbackMessage(status: number): string {
  if (status >= 500) return 'Server error - please try again later.'
  if (status === 404) return 'Resource not found.'
  if (status === 403) return 'Access denied.'
  if (status === 401) return 'Session expired - please log in again.'
  return `Unexpected error (${status}).`
}
