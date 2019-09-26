// libUtil
//import { Imdat } from "../include/libData";

class libUtil {
    name: string;
    //
    constructor(theName: string) { 
        this.name = theName; 
    }
    /******************************** 
    *
    *********************************/
    public convert_date2(item : string): string{
        let ret = ""
        let col = item.split(" ")
        let dt = col[0]
        let row = dt.split("/")
        ret = row[0] +"-"+ row[1] +"-"+ row[2]
        return ret
    }
    /******************************** 
    *
    *********************************/
    public convert_str2date(item: string): Date{
        let ret:any = ""
        let col = item.split(" ")
        var dt = col[0]
        let row: any[] = dt.split("/")
        var month = row[1]
        ret =new Date(row[0], month -1 , row[2], 0 ,0 , 0)
        return ret
    }
    /******************************** 
    *
    *********************************/
    public convert_date2yymmdd(date :any): string{
        var ret = ""
        var yyyy = date.getFullYear()
        var mm = date.getMonth() + 1
        mm = ("0" +mm).slice(-2)
        var dd  = date.getDate();
        dd = ("0" +dd).slice(-2)
        var s = yyyy + "-" + mm + "-"+ dd
        //console.log( s );
        return s
    }

}

export { libUtil };

