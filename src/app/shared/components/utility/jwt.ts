const isExpired = (token: string) => {
  // Get the payload part of the token
  const payload = getPayload(token);

  // Get the expiration time from the payload
  const expirationTime = payload.exp * 1000;

  return expirationTime < Date.now();
};
  
const getPayload = (token: string) => {
  const tokenParts = token.split('.');

  return JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));
}

const jwtUtilities = {
  isExpired,
  getPayload,
}

export default jwtUtilities;