import { Request, Response, NextFunction } from "express";
import z from "zod";

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (request: Request, response: Response, next: NextFunction) => {
		const validacao = schema.safeParse(request.body)

		if(validacao.error){
			response.status(400).json({errors:z.treeifyError(validacao.error)})
			return
		}

		next()
	};
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (request: Request, response: Response, next: NextFunction) => {
		const validacao = schema.safeParse(request.params)

		if(validacao.error){
			response.status(400).json({errors:z.treeifyError(validacao.error)})
			return
		}

		next()
	};
}

