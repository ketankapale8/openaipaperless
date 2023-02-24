import Head from "next/head";
import React, { useState } from 'react';
import Select from 'react-select';
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState();
  const [loading , setLoading] = useState(false)

  const options = [
    { value: 'What is Paperless?', label: 'What is Paperless' },
    { value: 'what are paperless invoices?', label: 'what are paperless invoices' },
    { value: 'What is a Paperless App?', label: 'What is a Paperless App' },
    {value : 'what are the uses of paperless bills?' , label : 'what are the uses of paperless bills?'}
  ];

  async function onSubmit(event) {

    event.preventDefault();
    if(loading){
      return
    }
    setLoading(true);
    console.log(selectedOption)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: selectedOption.value}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.replaceAll('\n', '<br/>'));
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

    setLoading(false)
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
        <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
          <input type="submit" value="Generate outcomes" />
        </form>

        {result && 
          <div className={styles.result}
            dangerouslySetInnerHTML={{__html : result}}
          />
        
        }
      </main>
    </div>
  );
}
