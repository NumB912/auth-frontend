import jwt from 'jsonwebtoken'

export async function verifyToken(token: string): Promise<jwt.JwtPayload> {
  const secret = process.env.SECRET_KEY

  if (!secret) {
    throw new Error('SECRET_KEY chưa được cấu hình')
  }

  const decoded = jwt.verify(token, secret)

  if (typeof decoded === 'string') {
    throw new Error('Token không hợp lệ')
  }

  return decoded as jwt.JwtPayload
}