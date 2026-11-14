import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [agesByProduct, setAgesByProduct] = useState({})

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
        setAgesByProduct(Object.fromEntries(response.data.products.map((product) => [
          product._id,
          (product.ages ?? product.age ?? []).map(Number).filter((age) => Number.isInteger(age) && age >= 0 && age <= 14)
        ])))
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const toggleAge = (productId, age) => {
    setAgesByProduct(current => {
      const selectedAges = current[productId] ?? []
      return {
        ...current,
        [productId]: selectedAges.includes(age)
          ? selectedAges.filter(item => item !== age)
          : [...selectedAges, age].sort((a, b) => a - b)
      }
    })
  }

  const saveAges = async (productId) => {
    const ages = agesByProduct[productId] ?? []
    if (ages.length === 0) {
      toast.error('Select at least one product age')
      return
    }

    try {
      const response = await axios.post(backendUrl + '/api/product/ages', { id: productId, ages }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name / available ages</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <div>
                <p>{item.name}</p>
                <div className='flex flex-wrap gap-1 mt-1'>
                  {Array.from({ length: 15 }, (_, age) => {
                    const selected = (agesByProduct[item._id] ?? []).includes(age)
                    return (
                      <button
                        type="button"
                        key={age}
                        onClick={() => toggleAge(item._id, age)}
                        className={`${selected ? 'bg-pink-100' : 'bg-slate-200'} px-1.5 py-0.5 text-xs`}
                        aria-pressed={selected}
                      >
                        {age}
                      </button>
                    )
                  })}
                  <button type="button" onClick={() => saveAges(item._id)} className='px-1.5 py-0.5 bg-black text-white text-xs'>
                    Save ages
                  </button>
                </div>
              </div>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }

      </div>
    </>
  )
}

export default List