# Archivo de Configuración
Archivo de configuración **CNET2FLEX_Config.xml**

## Objetivo
Entregar flexlibilidad a la operación de la app, poniendo a disposición nodos de configuración que permitirán dinamismo en su uso, por ejemplo, la utilización para varias "Empresas" del ERP Flexline que posee Starfood.

## Estructura
Es un archivo .xml que posee un nodo llamado "setting" el cual diferenciará el concepto que controla a traves de su atributo.  Ejemplo:

```xml {1,5-6}
<setting name="RutSociedades" serializeAs="Xml">
    <value>
      <ArrayOfString xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <string>78279920-7;IMPORTADORA Y COMERCIAL STARFOOD LTDA.;002;7801434CL0001</string>
        <string>76098197-4;DISTRIBUIDORA STARFOOD;008;7804647530004</string>
      </ArrayOfString>
    </value>
  </setting>
```


- En el ejemplo, se observa el atributo "RutSociedades" que corresponde a los datos de las empresas configuradas en Flexline.  
- Cada nodo posee una etiqueta "value" la cual indica el Namespace y los datos por los que se compone.
- Como en el ejemplo, algunos datos podrían venir separados por ";", esto implica la creación de un arreglo de forma interna (en particular el primer dato corresponde al rut de Flexline, el segundo en nombre y el tercero la casilla EDI del cliente)

## Lista de Elementos

|Atributo| Descripción| Tipo | 
|--|--|--| 
| GNL | Es el GNL de Dirección de despacho de cada cliente. | Opcional| 
| RUTSociedades | Identificación de las sociedades "Empresas" que  posee el ERP Flexline. | Obligatorio| 
| CtacteComercioNet2Flex | Equivalencia de código identificación  Flexline (Ctacte) con Casilla EDI. | Opcional| 
| FTPServer | Dirección FTP para descarga de archivos (uso futuro). | Opcional| 
| FTPPort | Puerto FTP para descarga de archivos (uso futuro). | Opcional| 
| FTPUser | Usuario FTP para descarga de archivos (uso futuro). | Opcional| 
| FTPPassword | Contraseña usuario FTP para descarga de archivos (uso futuro). | Opcional| 
| SMTPName | Nombre servidor SMTP | Obligatorio| 
| SMTPPort | Puerto servidor SMTP | Obligatorio| 
| EnableSSL | Habilita Protocolo SSL (recomendado) | Obligatorio| 
| EmailUser | Cuenta de correo CNet2Flexline, para el envío de Email de aviso | Obligatorio| 
| EmailTO | Dirección de Correo destino | Obligatorio| 
| EmailTO2 | Dirección de Correo destino 2 (copia) | Obligatorio| 
| DirectorioFTPCNET | Directorio de trabajo donde app irá a buscar archivo xml | Obligatorio| 
| StringConexionSisPal | String de conexión a BD Sispal (Obsoleto) | Opcional| 
| StringConexionFlexline | String de conexión a BD Flexline  | Opcional| 





## Elementos de datos

### GNL
Es el GNL de Dirección de despacho de cada cliente.  Este dato es sólo de respaldo pues el dato es extraído desde la tabla [ctacteDirecciones](./proceso.md#direcciones-de-despacho) de Flexline.  
    
- Datos separados por ";" 
    - Casilla EDI 
    - Nombre 
    - Dirección 
    - Comuna

```xml {1,5-6}
<setting name="GLN" serializeAs="Xml">
      <value>
        <ArrayOfString xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <string>7807900001686;WalMart C/Distribucion Lo Aguirre;Avda Los Vientos 2055;SANTIAGO</string>
          <string>7808810008406;SUPERMERCADOS MONTSERRAT SAC. (EL BOSQUE); JOSE MIGUEL CARRERA 13125;EL BOSQUE</string>
        </ArrayOfString>
      </value>
    </setting>  
```

### RUTSociedades 
Identificación de las sociedades "Empresas" que posee el ERP Flexline. Es una lista auxiliar, sólo en caso de no leer los datos desde ERP.
    
- Datos separados por ";" 
    - Ctacte Flex
    - Nombre
    - Casilla EDI

```xml {1,5-6}
<setting name="RutSociedades" serializeAs="Xml">
    <value>
      <ArrayOfString xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <string>78279920-7;IMPORTADORA Y COMERCIAL STARFOOD LTDA.;002;7801434CL0001</string>
        <string>76098197-4;DISTRIBUIDORA STARFOOD;008;7804647530004</string>
      </ArrayOfString>
    </value>
  </setting>
```

### CtacteComercioNet2Flex 
Equivalencia de código identificación Flexline (Ctacte) con Casilla EDI. Es una lista auxiliar, sólo en caso de no leer los datos desde ERP.

- Datos separados por ";" 
    - Casilla EDI
    - Ctacte Flexline
    - Nombre Cliente
    - Lista de Precios
    
```xml {1,5-9}
  <setting name="CtacteComercioNet2Flex" serializeAs="Xml">
    <value>
      <ArrayOfString xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <string>925485K200;76042014;WALMART CHILE S.A.;LIDER 4</string>
        <string>7807913CL0001;93307000;SUPERMERCADOS MONTSERRAT S.A.C.;LIDER 4</string>
        <string>7808800117842;81537600;RENDIC HERMANOS S.A.;LIDER 4</string>
        <string>7808800008669;78627210;HIPERMERCADO TOTTUS S.A.;LIDER 4</string>
        <string>7800110CL0001;96618540;ALVI SUPER MAYORISTA S.A.;LIDER 4</string>
      </ArrayOfString>
    </value>
  </setting>
```
