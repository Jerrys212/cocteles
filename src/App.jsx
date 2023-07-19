import axios from "axios";
import { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";
import Swal from "sweetalert2";

const App = () => {
  // Estados locales del componente
  const [bebidas, setBebidas] = useState([]); // Estado para almacenar la lista de bebidas obtenidas de la API
  const [alcohol, setAlcohol] = useState("Alcoholic"); // Estado para determinar si mostrar bebidas con alcohol o sin alcohol

  // Hook useEffect para cargar la lista de bebidas al montar el componente o cuando cambia el estado 'alcohol'
  useEffect(() => {
    // Función asincrónica para obtener las bebidas desde la API
    const obtenerBebidas = async () => {
      try {
        const { data } = await axios.get(
          `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcohol}`
        );
        setTimeout(() => {
          setBebidas(data.drinks);
        }, 1500);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerBebidas();
  }, [alcohol]);

  console.log(alcohol);

  const handleModal = async (id) => {
    try {
      const { data } = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      Swal.fire({
        title: `${data.drinks[0].strDrink}`,
        text: `${data.drinks[0].strInstructions}`,
        imageUrl: `${data.drinks[0].strDrinkThumb}`,
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: "Custom image",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="contenedor inicio">
        <h1>Seleccione una opción:</h1>

        <div className="opciones">
          {/* Botón para mostrar bebidas con alcohol */}
          <button
            className={` ${
              alcohol === "Alcoholic"
                ? "opciones__con-deshabilitado"
                : "opciones__con"
            }`}
            onClick={() => {
              setBebidas([]);
              setAlcohol("Alcoholic");
            }}
          >
            Con Alcohol
          </button>

          {/* Botón para mostrar bebidas sin alcohol */}
          <button
            className={`${
              alcohol === "Non_Alcoholic"
                ? "opciones__sin-deshabilitado"
                : "opciones__sin"
            }`}
            onClick={() => {
              setBebidas([]);
              setAlcohol("Non_Alcoholic");
            }}
          >
            Sin Alcohol
          </button>
        </div>
      </div>
      {/* Mostrar la lista de bebidas si hay elementos en el estado 'bebidas' */}
      {bebidas?.length > 0 ? (
        <div className="contenedor cards">
          {/*  Mapeo para renderizar cada tarjeta de bebida */}
          {bebidas.map((bebida) => (
            <div className="card" key={bebida.idDrink}>
              <div className="card__imagen">
                <img src={bebida.strDrinkThumb} alt={bebida.strDrink} />
              </div>
              <div className="card__contenido">
                <h3 className="card__nombre">{bebida.strDrink}</h3>
                {/* Botón para ver más detalles de la bebida */}
                <button
                  className="card__boton"
                  onClick={() => handleModal(bebida.idDrink)}
                >
                  Ver Más
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="spinner">
          {/** Mostrar el spinner circular mientras se cargan los datos si no hay elementos en el estado bebidas */}
          <SpinnerCircular size={400} color="#1976d2" />
        </div>
      )}
    </>
  );
};

export default App;
