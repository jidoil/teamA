import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {useNavigate} from "react-router-dom"



function HeadProduct(props){
    let navigate = useNavigate();
    const onClick = (e) => {  
        e.preventDefault();       
        const idx = props.id
        navigate(`/product/productdetail/${idx}`)
       }

       const imagestyle = {
        width: 90,
        height: 90
      }
        return (
            <TableRow onClick={onClick}>  
                <TableCell>{props.id}</TableCell>
                <TableCell><img src ={props.image} alt="Profile" style={imagestyle}/></TableCell>
                <TableCell>{props.product}</TableCell>
                <TableCell>{props.price}</TableCell>
            </TableRow>
        )

} 


export default HeadProduct;