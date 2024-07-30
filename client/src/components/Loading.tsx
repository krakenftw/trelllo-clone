"use client"
import { useEffect } from 'react'

export default function Loader() {
  useEffect(() => {
    async function getLoader() {
      const {helix } = await import('ldrs')
      helix.register()
    }
    getLoader()
  }, [])
  return <div className='h-screen w-screen flex items-center justify-center'><l-helix color="black"></l-helix>
</div>}