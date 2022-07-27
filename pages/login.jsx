import { useRef, useEffect } from 'react'
import Layout from '@/components/modules/layout'


export default function Login() {

  return (
    <Layout>
      <div className="w-full">
        <div className="h-20 w-full p-4 flex items-center">
          <span>ESD in ECS
          </span>
        </div>
        <div className="h-80 w-64 flex flex-col items-center justify-center mx-auto space-y-6 mt-20">
          <h3 className="m-0">Sign In</h3>
          <div className="w-full h-14 bg-[#50d71e] flex p-4">
            <div className="w-6 h-full bg-white text-center mr-6">
              <span>
                G
              </span>
            </div>
            <span>
              Sign in with Google
            </span>
          </div>
          <div className="w-full h-full">
            <form>
              <div className="flex flex-col">
                <span>Email</span>
                <input type="email" className="w-full h-14 border" placeholder="Email" />
              </div>
              <div className="flex flex-col">
                <span>Password</span>
                <input type="password" className="w-full h-14 border" placeholder="Password" />
              </div>
            </form>
          </div>
          <button className="w-full h-14 bg-[#50d71e] flex p-4 flex justify-center">
            <span>
              Sign in
            </span>
          </button>
        </div>
      </div>
    </Layout>
  )
}
