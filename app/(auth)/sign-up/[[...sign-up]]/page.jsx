import React from 'react'
import { SignUp } from '@clerk/nextjs'
import AuthLayout from '../../layout'

const Page = () => {
  return (
    <AuthLayout>
<SignUp/>
</AuthLayout>
  )
}

export default Page
