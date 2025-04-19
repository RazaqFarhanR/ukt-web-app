import React, { useEffect, useState } from "react"
import dynamic from 'next/dynamic';
import axios from "axios";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


function EditorQuill(props) {
  const [value, setValue] = useState('');
  const [idCatatan, setIdCatatan] = useState(null);
  const [logged, setLogged] = useState();
  const [alert, setAlert] = useState('');

  const getData = () => {
    const token = localStorage.getItem('token')

    props.type === 'cabang'
      ? axios.get(BASE_URL + `catatan/cabang/${props.cabang}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          console.log(res);
          setValue(res.data.data.text);
          setIdCatatan(res.data.data.id_catatan);
          setLogged(res.data.logged)
        })
        .catch(error => {
          error.logged ? '' : setValue('');
          setLogged(false)
          console.log(error.message);
        })
      : axios.get(BASE_URL + `catatan/ranting/${props.ranting}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          console.log(res);
          setValue(res.data.data.text);
          setIdCatatan(res.data.data.id_catatan);
          setLogged(res.data.logged)
        })
        .catch(error => {
          error.logged ? '' : setValue('');
          setLogged(false)
          console.log(error.message);
        })
  }

  const handleSave = () => {
    const token = localStorage.getItem('token')
    let formCabang = {
      id_cabang: props.cabang ? props.cabang : 'jatim',
      text: value
    }
    let formRanting = {
      id_ranting: props.ranting,
      text: value
    }
    logged
      ? axios.put(BASE_URL + `catatan/${idCatatan}`, props.type === 'cabang' ? formCabang : formRanting, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          console.log(res);
          setAlert(` -- ${res.data.message} --`)
        })
        .catch(error => {
          console.log(error.message);
        })
      : axios.post(BASE_URL + `catatan`, props.type === 'cabang' ? formCabang : formRanting, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          console.log(res);
          setAlert(` /-- ${res.data.message} --/`)
          setLogged(true);
        })
        .catch(error => {
          console.log(error.message);
        })

  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'align', // Added 'align' format
  ];

  useEffect(() => {
    getData();
  }, [props])

  useEffect(() => {
    let timeoutId;

    if (alert) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setAlert(null);
      }, 2000);
    }

    // Clean up the timeout when the component unmounts or when the alert changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [alert]);

  return (
    <React.Fragment>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        formats={formats} // Pass the formats prop to include the 'align' format
        modules={{
          toolbar: [
            // Customize the toolbar to include the text-align button
            [{ align: [] }], // Text align buttons
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link',],
          ],
        }}
      />
      <div className="flex flex=-col">
        <button className="p-1 w-1/6 position text-lg text-center rounded-md m-1 my-2 hover:bg-emerald-500 bg-green text-white" onClick={() => handleSave()}>
          SAVE
        </button>
        <h2 className="text-sm text-green capitalize">{alert}</h2>
      </div>
    </React.Fragment>
  );
}

export default EditorQuill;