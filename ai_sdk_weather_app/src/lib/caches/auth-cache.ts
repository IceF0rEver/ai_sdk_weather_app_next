import { cache } from "react";
import { getSession, getUser } from "../auth/server";

export const getCachedUser = cache(getUser);
export const getCachedSession = cache(getSession);
