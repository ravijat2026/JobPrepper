import React from 'react'
interface Props {
    params: {
      id: string;
    };
  }

export const page = async ({params}:Props) => {
    const { id } = await params;
  return (
    <div className='flex h-screen justify-center items-center'>cover letter : {id}</div>
  )
}

export default page