import { Request, Response } from "express";
import pool from "../conexaoBd";

export class Materias {
    async controlador( req: Request, res: Response){
        const {rows: materias} = await pool.query(`select * from materias`)
        console.log(materias)
        return res.json(materias)
    }
}