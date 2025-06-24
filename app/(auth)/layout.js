import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className="flex justify-center pt-10 relative inset-0">
      {children}
    </div>
  )
}

export default AuthLayout;
