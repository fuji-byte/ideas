import { UUID } from "crypto"

export interface Task {
    id: string
    name: string
    completed: boolean
    description: string
    user_id: UUID
}
