import React from 'react'

import { useState } from "react";

const NewArtifact = (props) => {
const [image, setImage] = useState('');
 const [name, setName] = useState('');
 const [description, setDescription] = useState('');
 const [price, setPrice] = useState();

 const submitHandler = (e) => {
    e.preventDefault();

    if(!image || !name || !description || !price) {
        alert('Please fill up the form')
        return

    }
    props.addArtifact(image, name, description, price);
    
    setImage('')
    setName('')
    setDescription('')
    setPrice('')
};

return(
    <form className='zk' onSubmit={submitHandler}>
    <div class="form-row" >
      
        <input type="text" class="form-control" value={image}
             onChange={(e) => setImage(e.target.value)} placeholder="Image"/>

<input type="text" class="form-control mt-4" value={name}
           onChange={(e) => setName(e.target.value)} placeholder="Name Of Artifact"/>

<input type="text" class="form-control mt-4" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="Description Of Artifact"/>

<input type="text" class="form-control mt-4" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="price"/>

<button type="submit" class="btn btn-outline-dark lk">Add Artifact</button>

</div>
</form>
  
)
}
export default NewArtifact;
   