import { useParams } from 'react-router';
import Addbtn from './Add';

const Notebook = () => {
    let { id }= useParams();
    const idNumber = parseInt(id!);

    // id 이용해서 memochip들 가져오기
    
    return (
        <>
        <h2>Notebook ID: {id} </h2>
        <Addbtn notebook_id = { idNumber } />
        </>
    ); 
}

export default Notebook;