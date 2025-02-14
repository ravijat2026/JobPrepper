import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

const MockInterview = () => {
  return (
    <div>
        <h1 className='text-4xl md:text-6xl font-bold'>
            Mock Interview Preparation
        </h1>

        <h2 className='my-2'>Create and Start your AI Mock Interview</h2>

        <div className='mt-8'>
            <AddNewInterview/>
        </div>

    </div>
  )
}

export default MockInterview