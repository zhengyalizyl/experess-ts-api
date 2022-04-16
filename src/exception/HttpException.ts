class HttpException extends Error{//Error是全局的变量，不用导入
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