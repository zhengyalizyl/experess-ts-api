class HttpException extends Error{
    status:number;
    message:string;
    errors?:any

    constructor(status: number, message: string,error?:any){
        super(message);
        this.status = status;
        this.message = message;
        this.errors=error;
      }
}

export default HttpException;