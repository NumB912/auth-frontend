export interface ProfileProps {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  avatar: string,
  sex: "male"|"female"|"other",
  dateOfBirth: Date | undefined;
  provider: "email" | "google"
}
