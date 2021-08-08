
import React, { useState } from 'react';
// import React from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {

  const [thoughtText, setText] = useState(' ');
  const [characterCount, setCharacterCount] = useState(0);

  // useMutation hook 
  const [addThought, {error}] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought }}) {
      // Wrap it in a try/catch in case the thought doesn't exist yet
      try{
        // read what's currently in the cache
         const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
         // prepend the newest thought tot he front of the array
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought,...thoughts]}
      });
    } catch (e) {
      console.error(e);
    }

    // Update me object's cache, appending new thought to the end of the array
    const { me } = cache.readQuery({ query: QUERY_ME });
    cache.writeQuery({
      query: QUERY_ME,
      data: { me: { ...me, thoughts: [...me.thoughts, addThought]}}
    });
  }
});

  const handleChange = event => {
    if(event.target.value.length <= 280){
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    
    try{
      // add thought to database
      await addThought({
        variables: { thoughtText }
      });

      // clear from value
      setText('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };



  return (
    <div>
      <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form 
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought.."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea> 
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>

      </form>
    </div>
  );
};

export default ThoughtForm;