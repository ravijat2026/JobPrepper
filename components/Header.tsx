import { checkUser } from '@/lib/checkUser'
import React from 'react'
import Navbar from './Navbar';

const Header = async () => {
  await checkUser();
  return (
    <Navbar/>
  )
}

export default Header