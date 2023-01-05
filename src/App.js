import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API = "http://localhost:5000";

function App() {
  const [titulo, setTitulo] = useState('');
  const [tempo, setTempo] = useState('');
  const [afazeres, setAfazeres] = useState([]);
  const [carregamento, setCarregamento] = useState(false);
  const [progresso, setProgresso] = useState(0);

  useEffect(()=>{
    const carregaDado = async ()=>{
      setCarregamento(true);
      const res = await fetch(API + "/afazeres")
        .then((res)=>res.json())
        .then((data)=>data)
        .catch((err)=>console.log(err));  
      setCarregamento(false);
      setProgresso(100);
      setTimeout(() => {
        setAfazeres(res);
      }, 300);
    }

    carregaDado();
  },[]);

   const apagar = async (id) => {
    await fetch(
      API + "/afazeres/" + id,
      {
        method: "DELETE"
      }
    );
    setAfazeres((antigo) => antigo.filter((fazer) => fazer.id != id));
  };

  const editar = async (fazer) => {
    
    fazer.feito = !fazer.feito;

    const dado = await fetch(
      API + "/afazeres/" + fazer.id,
      {
        method: "PUT",
        body: JSON.stringify(fazer),
        headers: {
          "Content-type": "application/json",
        }
      }
    );
    setAfazeres((antigo) => antigo.map((faz) => (faz.id === dado.id ? faz = dado : faz)));
  };

  const submeter = async (e) => {
    e.preventDefault();
    const fazer = {
      id: parseInt(Math.random() * 99999999999),
      titulo,
      tempo,
      feito: false,
    };

    await fetch(
      API + "/afazeres",
      {
        method: "POST",
        body: JSON.stringify(fazer),
        headers: {
          "Content-type": "application/json",
        }
      }
    );
    
    setAfazeres((antigo) => [...antigo, fazer]);

    setTitulo('');
    setTempo('');
  };

  return (
    <div className="border border-dark container caixa app bg-gradient mt-5 rounded-3 p-0">
      <h1 className='p-2 text-center border-bottom border-dark m-0'>Afazeres</h1>
      <div className='container'>
        <div>
          <h2 className='my-2'>Insira sua próxima tarefa</h2>
          <form onSubmit={submeter}>
            <div className='my-2 row'>
              <label className='col-auto col-form-label' htmlFor='titulo'>O que fará?</label>
              <div className='col'>
                <input
                  className='form-control bg-dark text-white border-dark'
                  type="text"
                  id='titulo'
                  name='titulo'
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo || ''}
                  required
                  placeholder='Título'
                />
              </div>
            </div>
            <div className='my-2 row'>
              <label className='col-auto col-form-label' htmlFor='tempo'>Duração:</label>
              <div className='col'>
                <input
                  className='form-control bg-dark text-white border-dark'
                  type="number"
                  id='tempo'
                  name='tempo'
                  onChange={(e) => 
                  {
                    setTempo(e.target.value.replace(/\D+/,'').replace(/\D+/,''));
                  }
                  
                  }
                  value={tempo || ''}
                  min='0'
                  required
                  placeholder='Minutos'
                />
              </div>
            </div>
            <div className="d-grid gap-2">
              <button className='btn btn-dark btn-lg bg-gradient' type='submit'>Criar tarefa</button>
            </div>
          </form>
        </div>
        <h3>Lista de tarefas:</h3>
        <table className="align-middle table table-borderless table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Minutos</th>
              <th scope="col">Feito</th>
              <th scope="col">Apagar</th>
            </tr>
          </thead>
          <tbody>
        {afazeres.length === 0 && <tr><td colSpan='4'><div className="progress"><div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" aria-label="Carregando" aria-valuenow={progresso} aria-valuemin="0" aria-valuemax="100" style={{width: progresso + '%'}}></div></div></td></tr>}
        {afazeres.map((fazer) => (
            <tr key={fazer.id}>
              <td>{fazer.titulo}</td>
              <td>{fazer.tempo}</td>
              <td>
                <div className="form-check">
                <input onClick={() => editar(fazer)} className="form-check-input" type="checkbox" defaultChecked={fazer.feito} />
                </div>
              </td>
              <td><button onClick={() => apagar(fazer.id)} type="button" className="btn btn-outline-secondary btn-sm"><i className="bi bi-trash"></i></button></td>
            </tr>
        ))}
        </tbody>
        </table>
        <br />
        

      </div>
    </div>
  );
}

export default App;
