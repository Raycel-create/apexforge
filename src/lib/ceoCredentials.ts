const CEO_CREDENTIALS = {
  username: 'papakoEddie@tripzy.international',
  password: '19780111',
}

export function validateCEOCredentials(username: string, password: string): boolean {
  return username === CEO_CREDENTIALS.username && password === CEO_CREDENTIALS.password
}

export function getCEOUsername(): string {
  return CEO_CREDENTIALS.username
}
