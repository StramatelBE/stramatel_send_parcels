import React from 'react'
import useSocketData from '../stores/socketDataStore'

function dataComponents() {
  const {socketData} =  useSocketData()
  return (
    <div>
        {socketData.datas.map(data => (
            <div key={data.id}>
                {data.name} : {data.value}
            </div>
        ))}
      
    </div>
  )
}

export default dataComponents
