import * as React from "react";
import React from 'react';
import {Link} from 'react-router-dom';
export default()=> (<header className='p-4 shadow'>{
<Link to='/'><img src='/assets/brand/logo.png' height='50'/>
</Link>}<Link to='/login'>Login</Link></header>);