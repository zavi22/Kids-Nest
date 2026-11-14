import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPasword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }

      } else {

        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }

      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='relative flex flex-col items-center w-[90%] sm:max-w-xl m-auto mt-14 mb-14 gap-6 text-gray-800 bg-white border border-[#f0c58e] rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(181,99,51,0.15)]'>
      <div className='inline-flex items-center gap-4 mb-2 mt-2'>
        <hr className="border-none h-[2px] w-10 sm:w-16 bg-[#b56333]" />
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[2px] w-10 sm:w-16 bg-[#b56333]' />
      </div>
      {currentState === 'Login' ? '' : (
        <div className="relative w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#b56333]">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </svg>
          </span>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-[#f0c58e] bg-[#fffaf5] outline-none focus:border-[#b56333] transition-all placeholder:text-gray-400"
            placeholder="Name"
            required
          />
        </div>
      )}
      <div className="relative w-full">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#b56333]">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 7L2 7" />
          </svg>
        </span>

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-[#f0c58e] bg-[#fff3e8] outline-none focus:border-[#b56333] transition-all placeholder:text-gray-400"
          placeholder="Email"
          required
        />
      </div>
      <div className="relative w-full">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#b56333]">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <path d="M12 15v3" />
          </svg>
        </span>

        <input
          onChange={(e) => setPasword(e.target.value)}
          value={password}
          type="password"
          className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-[#f0c58e] bg-[#fff3e8] outline-none focus:border-[#b56333] transition-all placeholder:text-gray-400"
          placeholder="Password"
          required
        />
      </div>
      <div className="w-full flex justify-between items-center text-sm sm:text-base mt-[-5px] text-[#b56333]">
        <p className="cursor-pointer hover:text-[#8f4525] transition-colors">
          Forgot your password?
        </p>

        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer font-medium hover:text-[#8f4525] transition-colors"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer font-medium hover:text-[#8f4525] transition-colors"
          >
            Login Here
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-[#b56333] text-white rounded-full font-medium px-12 py-4 mt-3 w-full sm:w-auto min-w-[200px] shadow-[0_7px_0_#f0c58e,0_12px_25px_rgba(181,99,51,0.2)] hover:bg-[#984d28] hover:translate-y-[-2px] hover:shadow-[0_9px_0_#f0c58e,0_15px_25px_rgba(181,99,51,0.2)] active:translate-y-1 active:shadow-none transition-all duration-300"
      >
        {currentState === 'Login' ? 'Sign In →' : 'Sign Up →'}
      </button>    </form>
  )
}

export default Login
