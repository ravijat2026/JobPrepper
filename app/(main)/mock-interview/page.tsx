import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

const MockInterview = () => {
  return (
    <div>
        <h1 className='text-5xl md:text-6xl font-bold'>
            Mock Interview Preparation
        </h1>

        <h2>Create and Start yoyr AI Mock Interview</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
            <AddNewInterview/>
        </div>

    </div>
  )
}

export default MockInterview