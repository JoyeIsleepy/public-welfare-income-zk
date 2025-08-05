export interface Resume {
  hash: string
  merkleRoot: string
  owner: string
  timestamp: number
  verified: boolean
}

export interface User {
  address: string
  resumes: string[]
}

export interface ZKProof {
  proof: string
  publicSignals: string[]
}

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone?: string
    location?: string
  }
  experience: WorkExperience[]
  education: Education[]
  skills: string[]
  certifications?: Certification[]
}

export interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  verified: boolean
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  verified: boolean
}

export interface Certification {
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  verified: boolean
}