import React, {useState, useEffect} from 'react';
import Auxiliary from '../hoc/Auxiliary';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data3, setData3] = useState([]);
  const [sumArray, setSumArray] = useState([]);
  const [types, setTypes] = useState([]);
  const [dataForChart, setDataForChart] = useState({});
  const [typeValue, setTypeValue] = useState('');
  let months = ['May', 'June', 'July', 'August', 'September', 'October'];

  //get Data from API
  const fetchData = async() => {
    let chartD = await axios.get('http://localhost:3001/data');
    if(typeof(chartD) === 'string') {
      setChartData(JSON.parse(chartD));
    }
    else if(typeof(chartD) === 'object') {
      setChartData(chartD);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  // Store types in an Array
  const getTypes = () => {
    let data =  [...chartData.data];
    let arr = [];
    data.map(obj => {
      if(obj.Type !== '')
        arr.push(obj.Type);
    })
    arr = [...new Set(arr)].sort();
    setTypes(arr);
  }

  const getMonth = (dateData) => {
    switch(dateData) {
      case '01': return 'January'; break;
      case '02': return 'February'; break;
      case '03': return 'March'; break;
      case '04': return 'April'; break;
      case '05': return 'May'; break;
      case '06': return 'June'; break;
      case '07': return 'July'; break;
      case '08': return 'August'; break;
      case '09': return 'September'; break;
      case '10': return 'October'; break;
      case '11': return 'November'; break;
      case '12': return 'December'; break;
    }
  }

  // Re-arrange data for display
  const reArrange = () => {
    getTypes();
    let arr = [];
    let data =  [...chartData.data];
    data.map((obj, i) => {
        arr.push({
          'index': i+1,
          'Type': obj.Type,
          'Value': parseInt(obj.Number),
          'Month': getMonth(obj.Date.substring(3, 5))
        });
    })
    setData1(arr);
  }

  useEffect(() => {
   if(chartData.data && chartData.data.length > 0) {
      console.log('%cchart.js line:79 Original Data', 'color: #007acc;', chartData.data);
      reArrange();
    }
  }, [chartData.data])

  let arr3 = []; let arr4 = [];
  const findType = (ind) => {
      switch(ind) {
        case 0: return 'A'; break;
        case 1: return 'B'; break;
        case 2: return 'C'; break;  
        case 3: return 'D'; break;
        case 4: return 'E'; break;
    }
  }

  const prepareFinal = (arr3, arr4) => {
    let arr = [...sumArray];
    let arr1 = [];
    arr.map((obj, ind) => {
      arr1.push({'Type': arr3[ind], 'Value': obj.Value, 'Month': arr4[ind]});
    })
    setSumArray(arr1);
    console.log('%cchart.js line:102 Intermediate Array A', 'color: #007acc;', arr1);
  }

  const fillUpEmpty = (data) => {
    let arr = [...data3];
    for(let i=0; i<arr.length; i++) {
      for(let j=0; j<5; j++) {
        arr4.push(arr[i][0][0].Month);
        arr3.push(findType(j));
      }
    }
    prepareFinal(arr3, arr4);
  }

  useEffect(() => {
    if(data3.length > 0) { 
      fillUpEmpty(data3);
    }
  }, [data3]);

  // Modify existing array to sum up individual Type's values for that month
  useEffect(() => {
    if(data1) {
      let acc2Month = [];
      let arr_ = [];
      let sumArr = [];
      let arr = [...data1];
      for(let i=0; i<months.length; i++) {
        for(let j=0; j<types.length; j++) {
          acc2Month.push(arr.filter(el => { return el.Month===months[i] && el.Type===types[j]}));
        }
      }
      console.log('%cchart.js line:134 Intermediate Array', 'color: #007acc;', acc2Month);
      for(let i=0; i<acc2Month.length; i++) {
        let k = i;
        if(i%5===0 && i>0) {
          arr_.push(acc2Month.slice(k-5, k));
        }
        let j = acc2Month.length;
        if(j === k+1) {
          arr_.push(acc2Month.slice(k+1-5, k+1));
        }
      }
      console.log('%cchart.js line:145 3D Array', 'color: #007acc;', arr_);
      setData3(arr_);
      acc2Month.map((obj, index) => {
        if(obj) {
          sumArr.push({'Type': arr3[index], 'Value': obj
            .map(item => item.Value)
            .reduce((prev, curr) => prev + curr, 0), 'Month': arr4[index] 
          })
        }
      })
      setSumArray(sumArr);
    } 
  }, [data1]);

  // initially start with displaying 'A' Type's Chart
  useEffect(() => {
    if(sumArray.length > 0) {
      setIt(types[0]);
    }
  }, [sumArray])

  // change chart according to individual selected type
  const setIt = (selected) => {
    let values = [];
    let arr = [...sumArray];
    arr.map(obj => {
      if(selected === obj.Type) {
          values.push({'Type': obj.Type, 'Value': obj.Value, 'Month': obj.Month});
      }
    })
    console.log('%cchart.js line:175 DataForChart', 'color: #007acc;', values);
    setDataForChart(values);
  }

  // change handler for select drop-down
  const handleChange = (event) => {
    setIt(event.target.value);
    setTypeValue(event.target.value);
  }

  return(
    <Auxiliary>
      <div className="form-group" style={{marginLeft: '150px', marginTop: '40px'}}>
        <label>Select Type</label>
        <select style={{marginBottom: '100px', width: '15%'}} onChange={handleChange} className="form-control" id="exampleFormControlSelect1">
          {types.map((obj, index) => <option key={index} value={obj}>{obj}</option>)}
        </select>
        <BarChart width={screen.width/2} height={screen.height/2} data={dataForChart}>
          <XAxis dataKey="Month" stroke="#8884d8" />
          <YAxis />
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
          <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="Value" fill="#8884d8" barSize={30} />
        </BarChart>
      </div>
    </Auxiliary>
  );
};

export default Chart;
