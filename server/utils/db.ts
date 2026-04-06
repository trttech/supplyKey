import { Database } from "../db/base"

export const useDb = Database.getInstance().getQueryBuilder()

export * from "../db/repository"

