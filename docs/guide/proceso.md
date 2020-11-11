# Proceso de Inyección
A continuación se describirá el proceso de lectura, validación, inyección y respuesta de los documentos .xml (Ordenes de compra) según su secuencia lógica.  En cada etapa se describirán los criterios que usa la app y las configuraciones requeridas en Flexline ERP.

## Log's
La aplicación creará por defecto un directorio para almacenar los archivos .log en la misma ruta donde se encuentra su ejecutable.  Se creará un archivo .log por día, esto con el fin de que posteriormente se revisé la actividad de la app con algún software analizador de log's.  La estructura es la siguiente:

    - <Ruta ejecutable>/Logs/CNET2FLEXlog_AAAA_MM_DD.log

Ejemplo archivo log:

``` txt {1,8,15,17}
[10-11-2020 16:06:34] DEBUG - ======== Inicio Proceso ========
[10-11-2020 16:06:34] TRACE - Lee Configuraciones: C:\Cnet2Flexline\Distribuidora\CNet2Flexline_\CNET2FLEX_Config.xml
[10-11-2020 16:06:34] TRACE - Configuración leída con éxito
[10-11-2020 16:06:35] TRACE - 7 archivos encontrados 
[10-11-2020 16:06:35] TRACE - Leyendo Archivo \\sapp03\comercionet\7808800117842.7804647530004.47663289711.9.202011020826 
[10-11-2020 16:06:35] TRACE - Procesa Orden 47663289711 RENDIC HERMANOS S.A. del 02-11-2020 0:00:00
[10-11-2020 16:06:35] TRACE - Lectura xml con éxito
[10-11-2020 16:06:35] ERROR - Sin Dirección de Despacho
[10-11-2020 16:06:39] INFO - Email enviado con OC 47663289711
[10-11-2020 16:06:39] ERROR - No logró calcular o grabar XML \\sapp03\comercionet\7808800117842.7804647530004.47663289711.9.202011020826 correctamente.
[10-11-2020 16:06:39] TRACE - Terminado: Moviendo archivo 7808800117842.7804647530004.47663289711.9.202011020826 a directorio Objetados
[10-11-2020 16:06:39] TRACE - Leyendo Archivo \\sapp03\comercionet\7808800117842.7804647530004.47663315411.9.202011020840 
[10-11-2020 16:06:39] TRACE - Procesa Orden 47663315411 RENDIC HERMANOS S.A. del 02-11-2020 0:00:00
[10-11-2020 16:06:39] TRACE - Lectura xml con éxito
[10-11-2020 16:06:39] ERROR - Sin Dirección de Despacho
[10-11-2020 16:06:42] INFO - Email enviado con OC 47663315411
[10-11-2020 16:06:42] ERROR - No logró calcular o grabar XML \\sapp03\comercionet\7808800117842.7804647530004.47663315411.9.202011020840 correctamente.
[10-11-2020 16:06:42] TRACE - Terminado: Moviendo archivo 7808800117842.7804647530004.47663315411.9.202011020840 a directorio Objetados
```

## Lectura Archivo Configuración
En cada [directorio de trabajo](./#instalacion) se debe alojar el archivo de configuración [**CNET2FLEX_Config.xml**](./config.md), desde el cual se extraerán los datos necesarios para la ejecución de la aplicación.

### Consideraciones

- Si el archivo [**CNET2FLEX_Config.xml**](./config.md) no existe, la app enviará un error a la consola.
- Valida que existan los siguientes datos:
    - EmailUser
    - EmailTo
    - SMTPName
- Es necesario ingresar Rut de sociedades, de lo contrario enviará error en archivo .log
- Se testea la conexión a la BD Flexline, envíando error a la consola y anotación al archivo .log
- Por último, se valida que el directorio de trabajo [DirectorioFTPCNET](./config.md) sea válido.



## Lectura de Archivos .xml CNET
Por defecto la aplicación leerá todos los archivos que se encuentran en el directorio de trabajo, revisando aquellos que son xml válidos e ignorando aquellos que no lo sean.

La secuencia de proceso de los archivos es la siguiente:

### Verifica si el archivo es un xml válido
La verificación se basa en identificar si el archivo es XML válido y bien formado además de revisar el Namespace utilizado por ComercioNet.  

### Ordenes de compra 
La arquitectura de las Ordenes de Compra ComercioNet con esquema XML EAN.UCC considera tres capas que desempeñan distintas funciones. Estas capas son: Capa de Sobre o “Envelope”, Capa del Mensaje o “Message” y Capa del Documento o “Document”. Cada capa se encuentra anidada dentro de la otra siendo la Capa de Sobre la más externa. La combinación de ellas conforma el Mensaje XML.

Para la lectura de estos archivos en primer lugar se debe considerar la estructura con que esta especificado el nombre del archivo, este es:

::: tip
**[Casilla EDI Cliente].[Casilla EDI Starfood].[Numero OC].9.[AAAAMMDDHHMMSS]**

Ejemplo archivo: 925485K200.7804647530004.9100361316.9.202006101715

**925485K200** : Casilla EDI Cliente </br>
**7804647530004** : Casilla EDI Starfood </br>
**9100361316** : Numero OC </br>
**9** : Identificador ComercioNet de Orden de compra </br>
**202006101715**: 10 Oct 2020 10:17:15 hrs </br>
:::

#### Para el proceso de lectura de las OC's se encontraron las siguientes casuisticas:

- Para la lectura de la empresa requiere el dato de [RutSociedades](./config.md#rutsociedades)
- A partir del dato anterior, busca en Flexline los datos del cliente en tabla Ctacte el dato **Casilla EDI** que está configurado en el campo AnalisisE5.  Si no encuentra coincidencias deja los que posee en el archivo de configuración y rellenará los restantes con _null_.  
Los datos Flexline que extrae son:
    - Ctacte (Rut Cliente)
    - Nombre Cliente
    - Condición de Pago --> Sólo como auxiliar si no se encuentra la Condición de pago por la cantidad de días
    - Lista de Precios --> Sólo informativa, se extrae desde [LPCNET](./proceso.md#listas_de_precio_cnet)
    - Dirección, Comuna, Ciudad
    - Lista de Direcciones de despacho desde tabla CtacteDireccion  --> Se almacena en una colección para posteriormente buscar el GLN de despacho dato por el campo CtacteDireccion.IdenDireccion 
    - Ejecutivo asignado --> Se asigna en el momento de inyectar [documento Flexline](./proceso.md#integrador)
- Lectura Encabezado y Detalle de documento .xml

::: danger
Existe diferencias en la forma en que se construyen los xmls en particular con los Namespace entre algunos clientes (Walmart), por lo que la lectura se debió ajustar a esas diferencias.  En caso de cambios de Namespace se debe revisar el caso y ajustar según corresponda, de lo contrario al app no podrá leer el archivo xml. 
:::

## Valida Orden de compra
Una vez que se ha leído el archivo xml se realiza el proceso de revisión, recalculo y validación de los datos que vienen en el archivo xml para su traspaso e inyección a las tablas Gen_Documento? de Flexline.

Este proceso se realiza de la siguiente forma:

* Valida la existencia de la Orden de compra en Flexline a través del campo Documento.AnalisisE5 desde los documentos:   
    * Nota Venta CNet --> Límite de búsqueda 48 meses desde fecha servidor.
    * Nota de Venta y Nota VTA. S/LISTA --> Límite de búsqueda 2 meses desde fecha servidor.
    * En caso de que el registro OC se encuentre en tablas Gen_Documento no se consideran límites de tiempo.

* Obtiene Correlativo Interno Flexline --> Considera Documento y Gen_Documento 
</br>_Nota : No Actualiza registro de folios Flexline!!_

* Lee a partir de los días de Pago del archivo xml la condición de pago Flexline que coincida.  En caso de no encontrar registros asignará la condición de pago leída desde el maestro de Clientes de Flexline.  Las condiciones de pago a considerar se marcan en Flexline con el atributo "Cheque" en el campo Gen_TabCod.RelacionTipo1.

* Extrae el parámetro _Param.Iva_ con el valor de IVA vigente por fecha de servidor desde Flexline ERP.

* Busca en Maestro de Productos la Unidad y la vigencia del producto a partir de los datos la Lista de Precios CNET 

## Listas de Precio CNET 
fdsfdsf




## Direcciones de despacho 

## Integrador





## Programador de Tareas
