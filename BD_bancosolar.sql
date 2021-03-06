PGDMP           9        
        z         
   bancosolar    13.6    13.6     ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    41382 
   bancosolar    DATABASE     f   CREATE DATABASE bancosolar WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE bancosolar;
                felipe    false            ?            1259    41421    transferencias    TABLE     ?   CREATE TABLE public.transferencias (
    id integer NOT NULL,
    emisor integer,
    receptor integer,
    monto double precision,
    fecha timestamp without time zone
);
 "   DROP TABLE public.transferencias;
       public         heap    postgres    false            ?            1259    41419    transferencias_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.transferencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.transferencias_id_seq;
       public          postgres    false    203            ?           0    0    transferencias_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.transferencias_id_seq OWNED BY public.transferencias.id;
          public          postgres    false    202            ?            1259    41412    usuarios    TABLE     ?   CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(50),
    balance double precision,
    CONSTRAINT usuarios_balance_check CHECK ((balance >= (0)::double precision))
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false            ?            1259    41410    usuarios_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public          postgres    false    201            ?           0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public          postgres    false    200            *           2604    41424    transferencias id    DEFAULT     v   ALTER TABLE ONLY public.transferencias ALTER COLUMN id SET DEFAULT nextval('public.transferencias_id_seq'::regclass);
 @   ALTER TABLE public.transferencias ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202    203            (           2604    41415    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    200    201    201            ?          0    41421    transferencias 
   TABLE DATA           L   COPY public.transferencias (id, emisor, receptor, monto, fecha) FROM stdin;
    public          postgres    false    203          ?          0    41412    usuarios 
   TABLE DATA           7   COPY public.usuarios (id, nombre, balance) FROM stdin;
    public          postgres    false    201          ?           0    0    transferencias_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.transferencias_id_seq', 1, false);
          public          postgres    false    202            ?           0    0    usuarios_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);
          public          postgres    false    200            .           2606    41426 "   transferencias transferencias_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT transferencias_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.transferencias DROP CONSTRAINT transferencias_pkey;
       public            postgres    false    203            ,           2606    41418    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    201            /           2606    41427 )   transferencias transferencias_emisor_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT transferencias_emisor_fkey FOREIGN KEY (emisor) REFERENCES public.usuarios(id);
 S   ALTER TABLE ONLY public.transferencias DROP CONSTRAINT transferencias_emisor_fkey;
       public          postgres    false    2860    201    203            0           2606    41432 +   transferencias transferencias_receptor_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT transferencias_receptor_fkey FOREIGN KEY (receptor) REFERENCES public.usuarios(id);
 U   ALTER TABLE ONLY public.transferencias DROP CONSTRAINT transferencias_receptor_fkey;
       public          postgres    false    201    203    2860            ?      \.


      ?      \.


     