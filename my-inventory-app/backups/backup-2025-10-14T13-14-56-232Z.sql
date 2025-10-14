--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: CashEventType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CashEventType" AS ENUM (
    'SALE',
    'RETURN',
    'PRICE_QUERY',
    'ORDER'
);


ALTER TYPE public."CashEventType" OWNER TO postgres;

--
-- Name: ProductUnitCardStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductUnitCardStatus" AS ENUM (
    'CANDIDATE',
    'SPROUTED',
    'IN_REQUEST',
    'IN_DELIVERY',
    'CLEAR',
    'ARRIVED'
);


ALTER TYPE public."ProductUnitCardStatus" OWNER TO postgres;

--
-- Name: ProductUnitPhysicalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductUnitPhysicalStatus" AS ENUM (
    'IN_STORE',
    'SOLD',
    'CREDIT',
    'LOST',
    'IN_DISASSEMBLED',
    'IN_COLLECTED'
);


ALTER TYPE public."ProductUnitPhysicalStatus" OWNER TO postgres;

--
-- Name: UnitDisassemblyStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UnitDisassemblyStatus" AS ENUM (
    'MONOLITH',
    'DISASSEMBLED',
    'PARTIAL',
    'COLLECTED',
    'RESTORED'
);


ALTER TYPE public."UnitDisassemblyStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: cash_days; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_days (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    total double precision DEFAULT 0.00 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cash_days OWNER TO postgres;

--
-- Name: cash_days_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cash_days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cash_days_id_seq OWNER TO postgres;

--
-- Name: cash_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cash_days_id_seq OWNED BY public.cash_days.id;


--
-- Name: cash_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_events (
    id integer NOT NULL,
    type public."CashEventType" NOT NULL,
    amount double precision NOT NULL,
    notes text,
    cash_day_id integer NOT NULL,
    product_unit_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cash_events OWNER TO postgres;

--
-- Name: cash_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cash_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cash_events_id_seq OWNER TO postgres;

--
-- Name: cash_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cash_events_id_seq OWNED BY public.cash_events.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    path text NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name text NOT NULL,
    phone text,
    notes text
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: disassembly_scenarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disassembly_scenarios (
    id integer NOT NULL,
    name text NOT NULL,
    "partsCount" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "childProductCodes" jsonb NOT NULL,
    "parentProductCode" text NOT NULL
);


ALTER TABLE public.disassembly_scenarios OWNER TO postgres;

--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disassembly_scenarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disassembly_scenarios_id_seq OWNER TO postgres;

--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disassembly_scenarios_id_seq OWNED BY public.disassembly_scenarios.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    filename text NOT NULL,
    path text NOT NULL,
    "isMain" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "githubUrl" text,
    "localPath" text,
    "storageType" text DEFAULT 'local'::text NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_unit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_unit_logs (
    id integer NOT NULL,
    "productUnitId" integer NOT NULL,
    type text,
    message text NOT NULL,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_unit_logs OWNER TO postgres;

--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_unit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_unit_logs_id_seq OWNER TO postgres;

--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_unit_logs_id_seq OWNED BY public.product_unit_logs.id;


--
-- Name: product_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_units (
    id integer NOT NULL,
    serial_number text NOT NULL,
    "productId" integer NOT NULL,
    sale_price double precision,
    sold_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    credit_paid_at timestamp(3) without time zone,
    "isReturned" boolean DEFAULT false NOT NULL,
    is_credit boolean DEFAULT false NOT NULL,
    "parentProductUnitId" integer,
    product_category_id integer,
    product_category_name text,
    product_code text,
    product_description text,
    product_name text,
    product_tags jsonb,
    request_price_per_unit double precision,
    returned_at timestamp(3) without time zone,
    "statusCard" public."ProductUnitCardStatus" NOT NULL,
    "statusProduct" public."ProductUnitPhysicalStatus",
    created_at_candidate timestamp(3) without time zone,
    created_at_request timestamp(3) without time zone,
    "customerId" integer,
    quantity_in_candidate integer DEFAULT 0,
    quantity_in_request integer DEFAULT 0,
    "supplierId" integer,
    "spineId" integer,
    "disassembledParentId" integer,
    "disassemblyStatus" public."UnitDisassemblyStatus" DEFAULT 'MONOLITH'::public."UnitDisassemblyStatus" NOT NULL,
    "isParsingAlgorithm" boolean DEFAULT false NOT NULL,
    "disassemblyScenarioId" integer
);


ALTER TABLE public.product_units OWNER TO postgres;

--
-- Name: product_units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_units_id_seq OWNER TO postgres;

--
-- Name: product_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_units_id_seq OWNED BY public.product_units.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "categoryId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandId" integer,
    "spineId" integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: spines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spines (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "categoryId" integer,
    "imagePath" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandData" json
);


ALTER TABLE public.spines OWNER TO postgres;

--
-- Name: spines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spines_id_seq OWNER TO postgres;

--
-- Name: spines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spines_id_seq OWNED BY public.spines.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: cash_days id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_days ALTER COLUMN id SET DEFAULT nextval('public.cash_days_id_seq'::regclass);


--
-- Name: cash_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events ALTER COLUMN id SET DEFAULT nextval('public.cash_events_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: disassembly_scenarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disassembly_scenarios ALTER COLUMN id SET DEFAULT nextval('public.disassembly_scenarios_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_unit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_unit_logs ALTER COLUMN id SET DEFAULT nextval('public.product_unit_logs_id_seq'::regclass);


--
-- Name: product_units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units ALTER COLUMN id SET DEFAULT nextval('public.product_units_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: spines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spines ALTER COLUMN id SET DEFAULT nextval('public.spines_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b9a1a592-e80a-44c8-bee3-179ba70283a1	6097743f8f826ee9c930d428445ca4871ba277989671ce520d018d9440ac1cbf	2025-10-14 12:04:44.458092+03	20250821120718_init	\N	\N	2025-10-14 12:04:44.449309+03	1
1d6ebdfe-ed22-4a48-81b9-ce9e3abe5c31	44334d5f147b873799966a3a4c3a60ae16f4642dbe3051542ad5ba0c496f69b4	2025-10-14 12:04:44.588946+03	20251005102252_add_brand_data_to_spine	\N	\N	2025-10-14 12:04:44.583408+03	1
840995a2-9b0e-4d42-980d-10ade6442149	a3c0b3d748399cbd945ab90c4b7d0b62dd3277636b6f41e87cf2ec16439e5f22	2025-10-14 12:04:44.482478+03	20250822101836_add_products	\N	\N	2025-10-14 12:04:44.458336+03	1
395a3be8-a305-4b9c-92cd-ce14e4ffbaff	2a036f61a9dffbb5eac2939f47e527dfa47bee8f57a95597890d2a50a7177975	2025-10-14 12:04:44.494538+03	20250828083337_add_requests	\N	\N	2025-10-14 12:04:44.482747+03	1
1ed01887-bce9-429e-b5e4-284c71007d42	7f43e3217dfed2f0a559c35e1da19e16d7b816d98a02e70d482b7e9dd92103d0	2025-10-14 12:04:44.496498+03	20250828090249_add_requestitem_status_nullable_request	\N	\N	2025-10-14 12:04:44.49478+03	1
e7d2eb69-7921-429b-9ca2-e35e55732b54	24bdb8206665439383f9f6aa150099ac964a315705acb3445597c0a79c0da539	2025-10-14 12:04:44.590113+03	20251008080927_add_storage_fields_to_product_image	\N	\N	2025-10-14 12:04:44.589213+03	1
c27f2925-c439-4359-af05-c144557fce7b	745a1cf4d376e55517ac77da7b1f71104dea18edeca26c34c5b18c693abbf29c	2025-10-14 12:04:44.508503+03	20250830104144_add_supplier_customer_relations	\N	\N	2025-10-14 12:04:44.496737+03	1
937a9658-bd55-4bff-91c7-b4bcbf38754d	a3daecbe80eafe9cd640334c371673cf2656a1ff2f0da969ec9254b28430cd9f	2025-10-14 12:04:44.515388+03	20250909092344_delivery	\N	\N	2025-10-14 12:04:44.508724+03	1
a29f15a6-9049-46d6-8428-70155b601989	f1667b9846849fff9b81db03f415362255ecc60e266d9d17eecf668fb0b97a1c	2025-10-14 12:04:44.524493+03	20250911110306_add_product_units_relations	\N	\N	2025-10-14 12:04:44.515599+03	1
95c9f482-3ade-4db0-af0e-5c727a7d1a13	976bcf0b774d3b5b5c6f2b936ab5276ce377c22fbb619248d946085ed8bc85ac	2025-10-14 12:04:44.599783+03	20251009111713_add_disassembly_feature	\N	\N	2025-10-14 12:04:44.590377+03	1
10b4b83d-67a2-4237-970c-7d84f4149c5f	5984d33527fb4d6d25fa428fc923aef47de57848a7680ebad02c34443617af1a	2025-10-14 12:04:44.547055+03	20250914115946_add_cash_system	\N	\N	2025-10-14 12:04:44.524739+03	1
09cf475e-f903-4d42-b17a-a764c485213f	ab92b7b4fc02e31c966eb076324f1af13faccf362c5b1d7ae74d3b2763cdd6b9	2025-10-14 12:04:44.550131+03	20250923114109_add_cash_event_relation	\N	\N	2025-10-14 12:04:44.547294+03	1
27c7081d-babd-4053-a3e4-cfc87d975598	8ee17ad1ab36533275c785a2a5b8c455e31d69dfd54d0e28d937384a230b7df1	2025-10-14 12:04:44.565919+03	20250925093430_init	\N	\N	2025-10-14 12:04:44.550432+03	1
a0376433-a17e-4b50-9286-1e301c45d241	bb96e01bddaff8038b65f4ac87980ef3fc16032a94f6fa276e5abed4ac9c329d	2025-10-14 12:04:44.604334+03	20251010105616_fix_disassembly_relations	\N	\N	2025-10-14 12:04:44.600057+03	1
aab4e69a-6b5b-47df-b31f-02d30646fff2	91366dd8358f057d1b5d8ebf866055be3b6f6b9cfff556e365bed43cf77a6d1e	2025-10-14 12:04:44.567074+03	20250925110251_add_productunit_fields	\N	\N	2025-10-14 12:04:44.566227+03	1
db95ec42-f7d7-458e-95b5-7798a7ed08a2	b9586b45cf17922689d38e947d36e009e886f2a8f078053e2f25cf95ed31b724	2025-10-14 12:04:44.577086+03	20250926073852_add_spine_entity	\N	\N	2025-10-14 12:04:44.567339+03	1
8d4ecdb7-b280-40ff-ba83-98cd54e2febe	7e52e1dd5f7801459ab5ccefdb186139920e153dd53377ce73e41264c5ec8544	2025-10-14 12:04:44.58317+03	20250930104749_add_product_unit_logs	\N	\N	2025-10-14 12:04:44.577351+03	1
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, "createdAt", "updatedAt") FROM stdin;
1	Force	force	2025-10-14 09:20:26.65	2025-10-14 09:20:26.65
2	Forsage	forsage	2025-10-14 09:20:34.521	2025-10-14 09:20:34.521
3	RockFORCE	rockforce	2025-10-14 09:23:19.676	2025-10-14 09:23:19.676
4	Дело техники	delo-tehniki	2025-10-14 10:13:36.002	2025-10-14 10:13:36.002
5	JCB	jcb	2025-10-14 11:42:04.291	2025-10-14 11:42:04.291
6	Partner	partner	2025-10-14 12:05:05.836	2025-10-14 12:05:05.836
\.


--
-- Data for Name: cash_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_days (id, date, is_closed, total, created_at, updated_at) FROM stdin;
1	2025-10-13 21:00:00	f	118	2025-10-14 09:28:12.938	2025-10-14 12:14:02.34
\.


--
-- Data for Name: cash_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_events (id, type, amount, notes, cash_day_id, product_unit_id, created_at) FROM stdin;
1	SALE	12	Продажа: Головка ударная 36мм (12гр.), 1/2''	1	1	2025-10-14 09:30:56.717
2	SALE	5	Продажа: Головка TORX E10 1/4"	1	15	2025-10-14 11:20:13.105
3	SALE	8.22	Продажа: Ключ накидной TORX Е10×Е12	1	18	2025-10-14 11:33:23.008
4	RETURN	-8.22	Возврат: Ключ накидной TORX Е10×Е12 (Возврат товара)	1	18	2025-10-14 11:33:43.749
5	SALE	12	Продажа: Ключ накидной TORX Е10×Е12	1	18	2025-10-14 11:34:34.177
6	SALE	10	Продажа: Головка двенадцатигранная 30мм 1/2"	1	22	2025-10-14 11:39:54.982
7	SALE	40	Продажа: Подставка ремонтная 2т (h min 278mm, h max 425mm)	1	27	2025-10-14 11:49:57.11
8	SALE	25	Продажа: Съемник рулевых тяг универсальный 27-42мм, 1/2''	1	28	2025-10-14 12:03:55.155
9	RETURN	-25	Возврат: Съемник рулевых тяг универсальный 27-42мм, 1/2'' (Возврат товара)	1	28	2025-10-14 12:04:07.791
10	SALE	25	Продажа: Сверло ступенчатое HSS 4241(4-32мм), в блистере	1	30	2025-10-14 12:08:58.924
11	SALE	14	Продажа: Ключ комбинированный трещоточный 13мм	1	32	2025-10-14 12:14:02.338
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, path) FROM stdin;
1	Ручной инструмент	ruchnoy-instrument	/ruchnoy-instrument
2	Головки торцовые	golovki-tortsovye	/ruchnoy-instrument/golovki-tortsovye
3	1/2" ударные короткие	1-2-udarnye-korotkie	/ruchnoy-instrument/golovki-tortsovye/1-2-udarnye-korotkie
4	Е-профиль	e-profil	/ruchnoy-instrument/golovki-tortsovye/e-profil
5	E-Инструмент 1/4"	e-instrument-1-4	/ruchnoy-instrument/golovki-tortsovye/e-profil/e-instrument-1-4
6	Ключи	klyuchi	/ruchnoy-instrument/klyuchi
7	E-типа	e-tipa	/ruchnoy-instrument/klyuchi/e-tipa
8	1/2" короткие	1-2-korotkie	/ruchnoy-instrument/golovki-tortsovye/1-2-korotkie
9	Оборудование	oborudovanie	/oborudovanie
10	Подъемное	pod-emnoe	/oborudovanie/pod-emnoe
11	Подставки	podstavki	/oborudovanie/pod-emnoe/podstavki
12	Специальный инструмент	spetsial-nyy-instrument	/spetsial-nyy-instrument
13	Ходовая часть	hodovaya-chast	/spetsial-nyy-instrument/hodovaya-chast
14	Тяги, шаровые опоры	tyagi-sharovye-opory	/spetsial-nyy-instrument/hodovaya-chast/tyagi-sharovye-opory
15	Съемник рулевых тяг	s-emnik-rulevyh-tyag	/spetsial-nyy-instrument/hodovaya-chast/tyagi-sharovye-opory/s-emnik-rulevyh-tyag
16	Металлообработка	metalloobrabotka	/ruchnoy-instrument/metalloobrabotka
17	Сверла, фрезы	sverla-frezy	/ruchnoy-instrument/metalloobrabotka/sverla-frezy
18	Сверло ступенчатое	sverlo-stupenchatoe	/ruchnoy-instrument/metalloobrabotka/sverla-frezy/sverlo-stupenchatoe
19	Трещеточные	treschetochnye	/ruchnoy-instrument/klyuchi/treschetochnye
20	Ключ комбинированный трещоточный	klyuch-kombinirovannyy-treschotochnyy	/ruchnoy-instrument/klyuchi/treschetochnye/klyuch-kombinirovannyy-treschotochnyy
21	Биты	bity	/ruchnoy-instrument/bity
22	10мм длинные	10mm-dlinnye	/ruchnoy-instrument/bity/10mm-dlinnye
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, name, phone, notes) FROM stdin;
\.


--
-- Data for Name: disassembly_scenarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disassembly_scenarios (id, name, "partsCount", "isActive", "createdAt", "updatedAt", "childProductCodes", "parentProductCode") FROM stdin;
1	Разборка на 2 частей	2	t	2025-10-14 11:49:04.391	2025-10-14 11:49:04.391	["JCB-TH52002C-Part", "JCB-TH52002C-Part2"]	JCB-TH52002C
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", filename, path, "isMain", "createdAt", "githubUrl", "localPath", "storageType") FROM stdin;
1	1	RF-44836_1760433877993_1.jpg	/img/products/RF-44836/RF-44836_1760433877993_1.jpg	t	2025-10-14 09:24:37.995	\N	\N	local
2	2	603010_1760440514859_1.jpg	/img/products/603010/603010_1760440514859_1.jpg	t	2025-10-14 11:15:14.861	\N	\N	local
3	3	514412_1760441496965_1.jpg	/img/products/514412/514412_1760441496965_1.jpg	t	2025-10-14 11:31:36.967	\N	\N	local
4	4	622030_1760441908955_1.jpg	/img/products/622030/622030_1760441908955_1.jpg	t	2025-10-14 11:38:28.956	\N	\N	local
5	5	JCB-TH52002C_1760442274730_1.jpg	/img/products/JCB-TH52002C/JCB-TH52002C_1760442274730_1.jpg	t	2025-10-14 11:44:34.731	\N	\N	local
6	6	JCB-TH52002C-Part_1760442343761_1.jpg	/img/products/JCB-TH52002C-Part/JCB-TH52002C-Part_1760442343761_1.jpg	t	2025-10-14 11:45:43.762	\N	\N	local
7	7	JCB-TH52002C-Part2_1760442506678_1.jpg	/img/products/JCB-TH52002C-Part2/JCB-TH52002C-Part2_1760442506678_1.jpg	t	2025-10-14 11:48:26.68	\N	\N	local
8	8	RF-9T0801_1760443265093_1.jpg	/img/products/RF-9T0801/RF-9T0801_1760443265093_1.jpg	t	2025-10-14 12:01:05.096	\N	\N	local
9	9	PA-44740_1760443667328_1.jpg	/img/products/PA-44740/PA-44740_1760443667328_1.jpg	t	2025-10-14 12:07:47.33	\N	\N	local
10	10	RF-75713_1760443947997_1.jpg	/img/products/RF-75713/RF-75713_1760443947997_1.jpg	t	2025-10-14 12:12:27.998	\N	\N	local
11	11	RF-1747505 Premium_1760444227594_1.jpg	/img/products/RF-1747505 Premium/RF-1747505 Premium_1760444227594_1.jpg	t	2025-10-14 12:17:07.595	\N	\N	local
\.


--
-- Data for Name: product_unit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_unit_logs (id, "productUnitId", type, message, meta, "createdAt") FROM stdin;
1	1	SYSTEM	Unit автоматически создан из продукта Головка ударная 36мм (12гр.), 1/2''	\N	2025-10-14 09:24:43.233
2	1	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 09:24:59.572
3	2	SYSTEM	CLEAR unit создан как замена для кандидата #RF-44836-20251014-122443231-921881	{"purpose": "replacement_for_candidate", "sourceUnitId": 1, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-44836-20251014-122443231-921881"}	2025-10-14 09:27:48.343
4	1	IN_REQUEST	Создана одиночная заявка, цена: 5.64	{"pricePerUnit": 5.64, "clearReplacementUnitId": 2}	2025-10-14 09:27:48.35
5	1	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 09:28:05.305
6	1	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 09:28:05.308
7	1	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 09:28:05.311
8	1	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-14 09:30:56.712
9	3	SYSTEM	Unit автоматически создан из продукта Головка TORX E10 1/4"	\N	2025-10-14 11:15:45.644
10	3	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:17:12.437
11	4	SYSTEM	CLEAR unit создан как замена для кандидата #603010-20251014-141545642-385683	{"purpose": "replacement_for_candidate", "sourceUnitId": 3, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "603010-20251014-141545642-385683"}	2025-10-14 11:17:31.736
12	3	SPROUTED	Unit преобразован в SPROUTED для создания 11 дочерних заявок	{"pricePerUnit": 1.38, "childrenCount": 11}	2025-10-14 11:17:31.741
13	5	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 1, "parentUnitId": 3}	2025-10-14 11:17:31.745
14	6	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 2, "parentUnitId": 3}	2025-10-14 11:17:31.749
15	7	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 3, "parentUnitId": 3}	2025-10-14 11:17:31.752
16	8	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 4, "parentUnitId": 3}	2025-10-14 11:17:31.755
17	9	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 5, "parentUnitId": 3}	2025-10-14 11:17:31.758
18	10	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 6, "parentUnitId": 3}	2025-10-14 11:17:31.761
19	11	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 7, "parentUnitId": 3}	2025-10-14 11:17:31.764
20	12	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 8, "parentUnitId": 3}	2025-10-14 11:17:31.767
21	13	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 9, "parentUnitId": 3}	2025-10-14 11:17:31.77
22	14	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 10, "parentUnitId": 3}	2025-10-14 11:17:31.773
23	15	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 11, "parentUnitId": 3}	2025-10-14 11:17:31.776
24	5	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:25.5
25	5	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:25.502
26	5	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:25.504
27	6	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:27.819
28	6	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:27.821
29	6	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:27.823
30	7	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:29.521
31	7	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:29.523
32	7	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:29.525
33	8	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:31.297
34	8	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:31.299
35	8	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:31.301
36	9	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:32.744
37	9	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:32.746
38	9	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:32.748
39	10	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:34.075
40	10	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:34.077
41	10	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:34.079
42	11	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:35.259
43	11	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:35.262
44	11	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:35.264
45	12	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:38.002
46	12	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:38.004
47	12	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:38.007
48	13	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:39.964
49	13	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:39.968
50	13	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:39.97
51	14	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:42.197
52	14	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:42.199
53	14	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:42.201
54	15	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:43.795
55	15	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:43.797
56	15	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:43.799
57	15	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-14 11:20:13.1
58	16	SYSTEM	Unit автоматически создан из продукта Ключ накидной TORX Е10×Е12	\N	2025-10-14 11:32:00.931
59	16	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:32:12.082
60	17	SYSTEM	CLEAR unit создан как замена для кандидата #514412-20251014-143200930-317103	{"purpose": "replacement_for_candidate", "sourceUnitId": 16, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "514412-20251014-143200930-317103"}	2025-10-14 11:32:48.069
61	16	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 8.22, "childrenCount": 2}	2025-10-14 11:32:48.075
62	18	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 16}	2025-10-14 11:32:48.078
63	19	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 16}	2025-10-14 11:32:48.082
64	18	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:32:55.376
65	18	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:32:55.379
66	18	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:32:55.381
67	18	SALE	Товар продан за 8.22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 8.22, "buyerPhone": ""}	2025-10-14 11:33:22.987
68	18	RETURN	Товар возвращен. Причина: Возврат товара	{"returnReason": "Возврат товара", "previousStatus": "SOLD", "previousSalePrice": 8.22}	2025-10-14 11:33:43.745
69	18	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-14 11:34:34.173
70	20	SYSTEM	Unit автоматически создан из продукта Головка двенадцатигранная 30мм 1/2"	\N	2025-10-14 11:38:45.12
71	20	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:38:53.846
72	21	SYSTEM	CLEAR unit создан как замена для кандидата #622030-20251014-143845118-408920	{"purpose": "replacement_for_candidate", "sourceUnitId": 20, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622030-20251014-143845118-408920"}	2025-10-14 11:39:18.584
73	20	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 7.26, "childrenCount": 2}	2025-10-14 11:39:18.599
74	22	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 20}	2025-10-14 11:39:18.603
75	23	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 20}	2025-10-14 11:39:18.606
76	22	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:39:28.137
77	22	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:39:28.139
78	22	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:39:28.141
79	22	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-14 11:39:54.977
80	24	SYSTEM	Unit автоматически создан из продукта Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт	\N	2025-10-14 11:45:59.636
81	24	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:46:09.349
82	25	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-TH52002C-20251014-144559634-461770	{"purpose": "replacement_for_candidate", "sourceUnitId": 24, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-TH52002C-20251014-144559634-461770"}	2025-10-14 11:46:25.408
83	24	IN_REQUEST	Создана одиночная заявка, цена: 59.97	{"pricePerUnit": 59.97, "clearReplacementUnitId": 25}	2025-10-14 11:46:25.413
84	24	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:46:42.398
85	24	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:46:42.401
86	24	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:46:42.403
87	24	DISASSEMBLY_OPERATION	Выполнена разборка. Родитель: 24, Сценарий: 1	{"operation": "disassembly", "timestamp": "2025-10-14T11:49:30.894Z", "scenarioId": 1, "parentUnitId": 24, "childProductCodes": ["JCB-TH52002C-Part", "JCB-TH52002C-Part2"], "parentProductCode": "JCB-TH52002C"}	2025-10-14 11:49:30.895
88	26	DISASSEMBLY_OPERATION	Выполнена разборка. Родитель: 24, Сценарий: 1	{"operation": "disassembly", "timestamp": "2025-10-14T11:49:30.923Z", "scenarioId": 1, "parentUnitId": 24, "childProductCodes": ["JCB-TH52002C-Part", "JCB-TH52002C-Part2"], "parentProductCode": "JCB-TH52002C"}	2025-10-14 11:49:30.924
89	27	DISASSEMBLY_OPERATION	Выполнена разборка. Родитель: 24, Сценарий: 1	{"operation": "disassembly", "timestamp": "2025-10-14T11:49:30.925Z", "scenarioId": 1, "parentUnitId": 24, "childProductCodes": ["JCB-TH52002C-Part", "JCB-TH52002C-Part2"], "parentProductCode": "JCB-TH52002C"}	2025-10-14 11:49:30.926
90	27	SALE	Товар продан за 40 ₽	{"isCredit": false, "buyerName": "", "salePrice": 40, "buyerPhone": ""}	2025-10-14 11:49:57.089
91	28	SYSTEM	Unit автоматически создан из продукта Съемник рулевых тяг универсальный 27-42мм, 1/2''	\N	2025-10-14 12:01:13.726
92	28	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:01:22.645
93	29	SYSTEM	CLEAR unit создан как замена для кандидата #RF-9T0801-20251014-150113724-816881	{"purpose": "replacement_for_candidate", "sourceUnitId": 28, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-9T0801-20251014-150113724-816881"}	2025-10-14 12:02:50.742
94	28	IN_REQUEST	Создана одиночная заявка, цена: 10.92	{"pricePerUnit": 10.92, "clearReplacementUnitId": 29}	2025-10-14 12:02:50.756
95	28	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:03:36.601
96	28	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:03:36.604
97	28	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:03:36.608
98	28	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-14 12:03:55.15
99	28	RETURN	Товар возвращен. Причина: Возврат товара	{"returnReason": "Возврат товара", "previousStatus": "SOLD", "previousSalePrice": 25}	2025-10-14 12:04:07.787
100	30	SYSTEM	Unit автоматически создан из продукта Сверло ступенчатое HSS 4241(4-32мм), в блистере	\N	2025-10-14 12:07:53.497
101	30	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:08:02.608
102	31	SYSTEM	CLEAR unit создан как замена для кандидата #PA-44740-20251014-150753496-311876	{"purpose": "replacement_for_candidate", "sourceUnitId": 30, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "PA-44740-20251014-150753496-311876"}	2025-10-14 12:08:16.324
103	30	IN_REQUEST	Создана одиночная заявка, цена: 20.4	{"pricePerUnit": 20.4, "clearReplacementUnitId": 31}	2025-10-14 12:08:16.337
104	30	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:08:32.66
105	30	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:08:32.662
106	30	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:08:32.664
107	30	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-14 12:08:58.92
108	31	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:09:33.467
109	32	SYSTEM	Unit автоматически создан из продукта Ключ комбинированный трещоточный 13мм	\N	2025-10-14 12:12:41.238
110	32	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:12:52.852
111	33	SYSTEM	CLEAR unit создан как замена для кандидата #RF-75713-20251014-151241236-575125	{"purpose": "replacement_for_candidate", "sourceUnitId": 32, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-75713-20251014-151241236-575125"}	2025-10-14 12:13:25.225
112	32	IN_REQUEST	Создана одиночная заявка, цена: 9.69	{"pricePerUnit": 9.69, "clearReplacementUnitId": 33}	2025-10-14 12:13:25.237
113	32	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:13:34.821
114	32	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:13:34.824
115	32	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:13:34.826
116	32	SALE	Товар продан за 14 ₽	{"isCredit": false, "buyerName": "", "salePrice": 14, "buyerPhone": ""}	2025-10-14 12:14:02.319
117	34	SYSTEM	Unit автоматически создан из продукта Бита 6-гранная H5х75ммL,10мм	\N	2025-10-14 12:17:13.407
118	34	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:17:30.544
119	35	SYSTEM	CLEAR unit создан как замена для кандидата #RF-1747505 Premium-20251014-151713406-466685	{"purpose": "replacement_for_candidate", "sourceUnitId": 34, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-1747505 Premium-20251014-151713406-466685"}	2025-10-14 12:25:21.337
120	34	SPROUTED	Unit преобразован в SPROUTED для создания 11 дочерних заявок	{"pricePerUnit": 2.34, "childrenCount": 11}	2025-10-14 12:25:21.342
121	36	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 1, "parentUnitId": 34}	2025-10-14 12:25:21.345
122	37	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 2, "parentUnitId": 34}	2025-10-14 12:25:21.349
123	38	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 3, "parentUnitId": 34}	2025-10-14 12:25:21.352
124	39	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 4, "parentUnitId": 34}	2025-10-14 12:25:21.355
125	40	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 5, "parentUnitId": 34}	2025-10-14 12:25:21.358
126	41	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 6, "parentUnitId": 34}	2025-10-14 12:25:21.361
127	42	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 7, "parentUnitId": 34}	2025-10-14 12:25:21.364
128	43	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 8, "parentUnitId": 34}	2025-10-14 12:25:21.367
129	44	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 9, "parentUnitId": 34}	2025-10-14 12:25:21.37
130	45	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 10, "parentUnitId": 34}	2025-10-14 12:25:21.373
131	46	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 11, "parentUnitId": 34}	2025-10-14 12:25:21.375
132	19	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:25:31.637
133	19	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:25:31.64
134	19	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:25:31.643
135	23	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:25:37.788
136	23	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:25:37.79
137	23	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:25:37.792
138	36	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:00.058
139	36	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:00.06
140	36	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:00.062
141	37	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:04.112
142	37	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:04.114
143	37	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:04.115
144	38	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:06.911
145	38	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:06.913
146	38	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:06.915
147	39	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:08.876
148	39	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:08.878
149	39	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:08.882
150	40	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:10.542
151	40	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:10.545
152	40	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:10.546
153	41	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:12.411
154	41	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:12.413
155	41	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:12.414
156	42	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:14.143
157	42	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:14.145
158	42	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:14.146
159	43	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:16.609
160	43	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:16.611
161	43	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:16.613
162	44	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:18.484
163	44	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:18.49
164	44	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:18.492
165	45	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:20.21
166	45	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:20.212
167	45	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:20.214
168	46	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:23.239
169	46	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:23.242
170	46	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:23.244
171	23	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-14T12:48:22.807Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-14 12:48:22.808
\.


--
-- Data for Name: product_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_units (id, serial_number, "productId", sale_price, sold_at, created_at, updated_at, credit_paid_at, "isReturned", is_credit, "parentProductUnitId", product_category_id, product_category_name, product_code, product_description, product_name, product_tags, request_price_per_unit, returned_at, "statusCard", "statusProduct", created_at_candidate, created_at_request, "customerId", quantity_in_candidate, quantity_in_request, "supplierId", "spineId", "disassembledParentId", "disassemblyStatus", "isParsingAlgorithm", "disassemblyScenarioId") FROM stdin;
2	RF-44836-20251014-122748341-419995	1	\N	\N	2025-10-14 09:27:48.343	2025-10-14 09:27:48.343	\N	f	f	\N	3	1/2" ударные короткие	RF-44836		Головка ударная 36мм (12гр.), 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	1	\N	MONOLITH	f	\N
10	603010-20251014-141545642-385683/child-6-1760440651760-dvd0e6yy6	2	\N	\N	2025-10-14 11:17:31.761	2025-10-14 11:19:34.079	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.76	\N	0	0	\N	2	\N	MONOLITH	f	\N
7	603010-20251014-141545642-385683/child-3-1760440651751-7dg75j281	2	\N	\N	2025-10-14 11:17:31.752	2025-10-14 11:19:29.525	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.751	\N	0	0	\N	2	\N	MONOLITH	f	\N
14	603010-20251014-141545642-385683/child-10-1760440651772-68inq94l4	2	\N	\N	2025-10-14 11:17:31.773	2025-10-14 11:19:42.201	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.772	\N	0	0	\N	2	\N	MONOLITH	f	\N
1	RF-44836-20251014-122443231-921881	1	12	2025-10-14 09:30:56.711	2025-10-14 09:24:43.233	2025-10-14 09:30:56.712	\N	f	f	\N	3	1/2" ударные короткие	RF-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.64	\N	ARRIVED	SOLD	2025-10-14 09:24:59.571	2025-10-14 09:27:48.348	\N	1	0	\N	1	\N	MONOLITH	f	\N
8	603010-20251014-141545642-385683/child-4-1760440651754-k64jbb3u9	2	\N	\N	2025-10-14 11:17:31.755	2025-10-14 11:19:31.301	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.754	\N	0	0	\N	2	\N	MONOLITH	f	\N
4	603010-20251014-141731734-349576	2	\N	\N	2025-10-14 11:17:31.736	2025-10-14 11:17:31.736	\N	f	f	\N	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	2	\N	MONOLITH	f	\N
3	603010-20251014-141545642-385683	2	\N	\N	2025-10-14 11:15:45.644	2025-10-14 11:17:31.741	\N	f	f	\N	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	\N	\N	SPROUTED	\N	2025-10-14 11:17:12.436	\N	\N	1	0	\N	2	\N	MONOLITH	f	\N
11	603010-20251014-141545642-385683/child-7-1760440651763-ov3l2ul2k	2	\N	\N	2025-10-14 11:17:31.764	2025-10-14 11:19:35.264	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.763	\N	0	0	\N	2	\N	MONOLITH	f	\N
5	603010-20251014-141545642-385683/child-1-1760440651744-o85qjpreb	2	\N	\N	2025-10-14 11:17:31.745	2025-10-14 11:19:25.504	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.744	\N	0	0	\N	2	\N	MONOLITH	f	\N
27	JCB-TH52002C-20251014-144559634-461770_PART_1760442570889_7	7	40	2025-10-14 11:49:57.088	2025-10-14 11:49:30.89	2025-10-14 11:49:57.089	\N	f	f	\N	11	\N	JCB-TH52002C-Part2		Подставка ремонтная 2т (h min 278mm, h max 425mm)	\N	\N	\N	ARRIVED	SOLD	\N	\N	\N	0	0	\N	5	24	PARTIAL	f	\N
12	603010-20251014-141545642-385683/child-8-1760440651766-quhbm8msw	2	\N	\N	2025-10-14 11:17:31.767	2025-10-14 11:19:38.007	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.766	\N	0	0	\N	2	\N	MONOLITH	f	\N
6	603010-20251014-141545642-385683/child-2-1760440651748-5o9rynfgn	2	\N	\N	2025-10-14 11:17:31.749	2025-10-14 11:19:27.823	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.748	\N	0	0	\N	2	\N	MONOLITH	f	\N
9	603010-20251014-141545642-385683/child-5-1760440651757-qif4ibjm3	2	\N	\N	2025-10-14 11:17:31.758	2025-10-14 11:19:32.748	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.757	\N	0	0	\N	2	\N	MONOLITH	f	\N
15	603010-20251014-141545642-385683/child-11-1760440651775-w9sxthzcv	2	5	2025-10-14 11:20:13.099	2025-10-14 11:17:31.776	2025-10-14 11:20:13.1	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	SOLD	\N	2025-10-14 11:17:31.775	\N	0	0	\N	2	\N	MONOLITH	f	\N
18	514412-20251014-143200930-317103/child-1-1760441568077-vh9jmteff	3	12	2025-10-14 11:34:34.172	2025-10-14 11:32:48.078	2025-10-14 11:34:34.173	\N	f	f	16	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	8.22	\N	ARRIVED	SOLD	\N	2025-10-14 11:32:48.077	\N	0	0	\N	3	\N	MONOLITH	f	\N
13	603010-20251014-141545642-385683/child-9-1760440651769-5yiqlklv8	2	\N	\N	2025-10-14 11:17:31.77	2025-10-14 11:19:39.97	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.769	\N	0	0	\N	2	\N	MONOLITH	f	\N
17	514412-20251014-143248068-403129	3	\N	\N	2025-10-14 11:32:48.069	2025-10-14 11:32:48.069	\N	f	f	\N	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	3	\N	MONOLITH	f	\N
16	514412-20251014-143200930-317103	3	\N	\N	2025-10-14 11:32:00.931	2025-10-14 11:32:48.075	\N	f	f	\N	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	\N	\N	SPROUTED	\N	2025-10-14 11:32:12.081	\N	\N	1	0	\N	3	\N	MONOLITH	f	\N
26	JCB-TH52002C-20251014-144559634-461770_PART_1760442570885_6	6	\N	\N	2025-10-14 11:49:30.887	2025-10-14 11:49:30.887	\N	f	f	\N	11	\N	JCB-TH52002C-Part	ОДНА ПОДСТАВКА	Подставка ремонтная 2т (h min 278mm, h max 425mm)	\N	\N	\N	ARRIVED	IN_STORE	\N	\N	\N	0	0	\N	5	24	PARTIAL	f	\N
25	JCB-TH52002C-20251014-144625405-894424	5	\N	\N	2025-10-14 11:46:25.408	2025-10-14 11:46:25.408	\N	f	f	\N	11	Подставки	JCB-TH52002C		Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	5	\N	MONOLITH	f	\N
21	622030-20251014-143918582-810915	4	\N	\N	2025-10-14 11:39:18.584	2025-10-14 11:39:18.584	\N	f	f	\N	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	4	\N	MONOLITH	f	\N
20	622030-20251014-143845118-408920	4	\N	\N	2025-10-14 11:38:45.12	2025-10-14 11:39:18.599	\N	f	f	\N	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-14 11:38:53.845	\N	\N	1	0	\N	4	\N	MONOLITH	f	\N
22	622030-20251014-143845118-408920/child-1-1760441958602-i9f8qnamq	4	10	2025-10-14 11:39:54.976	2025-10-14 11:39:18.603	2025-10-14 11:39:54.977	\N	f	f	20	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	7.26	\N	ARRIVED	SOLD	\N	2025-10-14 11:39:18.602	\N	0	0	\N	4	\N	MONOLITH	f	\N
24	JCB-TH52002C-20251014-144559634-461770	5	\N	\N	2025-10-14 11:45:59.636	2025-10-14 11:49:30.893	\N	f	f	\N	11	Подставки	JCB-TH52002C		Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт	null	59.97	\N	ARRIVED	IN_DISASSEMBLED	2025-10-14 11:46:09.348	2025-10-14 11:46:25.412	\N	1	0	\N	5	\N	DISASSEMBLED	f	1
23	622030-20251014-143845118-408920/child-2-1760441958606-66kw14n0y	4	\N	\N	2025-10-14 11:39:18.606	2025-10-14 12:48:22.749	\N	f	f	20	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	7.26	\N	IN_REQUEST	\N	\N	2025-10-14 11:39:18.606	\N	0	0	\N	4	\N	MONOLITH	f	\N
29	RF-9T0801-20251014-150250741-831507	8	\N	\N	2025-10-14 12:02:50.742	2025-10-14 12:02:50.742	\N	f	f	\N	15	Съемник рулевых тяг	RF-9T0801		Съемник рулевых тяг универсальный 27-42мм, 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	6	\N	MONOLITH	f	\N
28	RF-9T0801-20251014-150113724-816881	8	\N	\N	2025-10-14 12:01:13.726	2025-10-14 12:04:07.787	\N	f	f	\N	15	Съемник рулевых тяг	RF-9T0801		Съемник рулевых тяг универсальный 27-42мм, 1/2''	null	10.92	\N	ARRIVED	IN_STORE	2025-10-14 12:01:22.643	2025-10-14 12:02:50.754	\N	1	0	\N	6	\N	MONOLITH	f	\N
30	PA-44740-20251014-150753496-311876	9	25	2025-10-14 12:08:58.919	2025-10-14 12:07:53.497	2025-10-14 12:08:58.92	\N	f	f	\N	18	Сверло ступенчатое	PA-44740		Сверло ступенчатое HSS 4241(4-32мм), в блистере	null	20.4	\N	ARRIVED	SOLD	2025-10-14 12:08:02.607	2025-10-14 12:08:16.336	\N	1	0	\N	7	\N	MONOLITH	f	\N
31	PA-44740-20251014-150816322-247159	9	\N	\N	2025-10-14 12:08:16.324	2025-10-14 12:09:33.467	\N	f	f	\N	18	Сверло ступенчатое	PA-44740		Сверло ступенчатое HSS 4241(4-32мм), в блистере	null	\N	\N	CANDIDATE	\N	2025-10-14 12:09:33.466	\N	\N	1	0	\N	7	\N	MONOLITH	f	\N
33	RF-75713-20251014-151325223-710237	10	\N	\N	2025-10-14 12:13:25.225	2025-10-14 12:13:25.225	\N	f	f	\N	20	Ключ комбинированный трещоточный	RF-75713		Ключ комбинированный трещоточный 13мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	8	\N	MONOLITH	f	\N
19	514412-20251014-143200930-317103/child-2-1760441568081-4eybvlrgs	3	\N	\N	2025-10-14 11:32:48.082	2025-10-14 12:25:31.643	\N	f	f	16	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	8.22	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:32:48.081	\N	0	0	\N	3	\N	MONOLITH	f	\N
32	RF-75713-20251014-151241236-575125	10	14	2025-10-14 12:14:02.318	2025-10-14 12:12:41.238	2025-10-14 12:14:02.319	\N	f	f	\N	20	Ключ комбинированный трещоточный	RF-75713		Ключ комбинированный трещоточный 13мм	null	9.69	\N	ARRIVED	SOLD	2025-10-14 12:12:52.851	2025-10-14 12:13:25.236	\N	1	0	\N	8	\N	MONOLITH	f	\N
35	RF-1747505 Premium-20251014-152521335-592523	11	\N	\N	2025-10-14 12:25:21.337	2025-10-14 12:25:21.337	\N	f	f	\N	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	9	\N	MONOLITH	f	\N
34	RF-1747505 Premium-20251014-151713406-466685	11	\N	\N	2025-10-14 12:17:13.407	2025-10-14 12:25:21.342	\N	f	f	\N	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	\N	\N	SPROUTED	\N	2025-10-14 12:17:30.543	\N	\N	1	0	\N	9	\N	MONOLITH	f	\N
38	RF-1747505 Premium-20251014-151713406-466685/child-3-1760444721351-m6lans1uc	11	\N	\N	2025-10-14 12:25:21.352	2025-10-14 12:26:06.915	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.351	\N	0	0	\N	9	\N	MONOLITH	f	\N
36	RF-1747505 Premium-20251014-151713406-466685/child-1-1760444721344-hvlpnn2m9	11	\N	\N	2025-10-14 12:25:21.345	2025-10-14 12:26:00.062	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.344	\N	0	0	\N	9	\N	MONOLITH	f	\N
37	RF-1747505 Premium-20251014-151713406-466685/child-2-1760444721348-aqbq8ct01	11	\N	\N	2025-10-14 12:25:21.349	2025-10-14 12:26:04.115	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.348	\N	0	0	\N	9	\N	MONOLITH	f	\N
39	RF-1747505 Premium-20251014-151713406-466685/child-4-1760444721354-o5qs83lse	11	\N	\N	2025-10-14 12:25:21.355	2025-10-14 12:26:08.882	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.354	\N	0	0	\N	9	\N	MONOLITH	f	\N
40	RF-1747505 Premium-20251014-151713406-466685/child-5-1760444721357-k80t46ma0	11	\N	\N	2025-10-14 12:25:21.358	2025-10-14 12:26:10.546	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.357	\N	0	0	\N	9	\N	MONOLITH	f	\N
41	RF-1747505 Premium-20251014-151713406-466685/child-6-1760444721360-qtgy6dcy4	11	\N	\N	2025-10-14 12:25:21.361	2025-10-14 12:26:12.414	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.361	\N	0	0	\N	9	\N	MONOLITH	f	\N
42	RF-1747505 Premium-20251014-151713406-466685/child-7-1760444721363-5enfjlybt	11	\N	\N	2025-10-14 12:25:21.364	2025-10-14 12:26:14.146	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.363	\N	0	0	\N	9	\N	MONOLITH	f	\N
43	RF-1747505 Premium-20251014-151713406-466685/child-8-1760444721366-kynsaor86	11	\N	\N	2025-10-14 12:25:21.367	2025-10-14 12:26:16.613	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.366	\N	0	0	\N	9	\N	MONOLITH	f	\N
44	RF-1747505 Premium-20251014-151713406-466685/child-9-1760444721369-7x7gmbvg5	11	\N	\N	2025-10-14 12:25:21.37	2025-10-14 12:26:18.492	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.369	\N	0	0	\N	9	\N	MONOLITH	f	\N
45	RF-1747505 Premium-20251014-151713406-466685/child-10-1760444721372-997efveom	11	\N	\N	2025-10-14 12:25:21.373	2025-10-14 12:26:20.214	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.372	\N	0	0	\N	9	\N	MONOLITH	f	\N
46	RF-1747505 Premium-20251014-151713406-466685/child-11-1760444721374-glunb3r9t	11	\N	\N	2025-10-14 12:25:21.375	2025-10-14 12:26:23.244	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.374	\N	0	0	\N	9	\N	MONOLITH	f	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, description, "categoryId", "createdAt", "updatedAt", "brandId", "spineId") FROM stdin;
1	RF-44836	Головка ударная 36мм (12гр.), 1/2''		3	2025-10-14 09:24:37.981	2025-10-14 09:24:37.981	3	1
2	603010	Головка TORX E10 1/4"		5	2025-10-14 11:15:14.843	2025-10-14 11:15:14.843	4	2
3	514412	Ключ накидной TORX Е10×Е12		7	2025-10-14 11:31:36.953	2025-10-14 11:31:36.953	4	3
4	622030	Головка двенадцатигранная 30мм 1/2"		8	2025-10-14 11:38:11.525	2025-10-14 11:38:28.953	4	4
5	JCB-TH52002C	Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт		11	2025-10-14 11:44:34.718	2025-10-14 11:44:34.718	5	5
6	JCB-TH52002C-Part	Подставка ремонтная 2т (h min 278mm, h max 425mm)	ОДНА ПОДСТАВКА	11	2025-10-14 11:45:43.758	2025-10-14 11:45:43.758	5	5
7	JCB-TH52002C-Part2	Подставка ремонтная 2т (h min 278mm, h max 425mm)		11	2025-10-14 11:48:26.666	2025-10-14 11:48:26.666	5	5
8	RF-9T0801	Съемник рулевых тяг универсальный 27-42мм, 1/2''		15	2025-10-14 12:01:05.08	2025-10-14 12:01:05.08	3	6
9	PA-44740	Сверло ступенчатое HSS 4241(4-32мм), в блистере		18	2025-10-14 12:07:47.324	2025-10-14 12:07:47.324	6	7
10	RF-75713	Ключ комбинированный трещоточный 13мм		20	2025-10-14 12:12:27.985	2025-10-14 12:12:27.985	3	8
11	RF-1747505 Premium	Бита 6-гранная H5х75ммL,10мм		22	2025-10-14 12:17:07.591	2025-10-14 12:17:07.591	3	9
\.


--
-- Data for Name: spines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spines (id, name, slug, "categoryId", "imagePath", "createdAt", "updatedAt", "brandData") FROM stdin;
1	Головка ударная 36мм (12гр.), 1/2''	golovka-udarnaya-36mm-12gr-1-2	3	\N	2025-10-14 09:22:10.795	2025-10-14 09:24:43.256	{"RockFORCE":{"displayName":"Головка ударная 36мм (12гр.), 1/2''","imagePath":"/img/products/RF-44836/RF-44836_1760433877993_1.jpg","productCode":"RF-44836","updatedAt":"2025-10-14T09:24:43.255Z"}}
2	Головка TORX E10 1/4"	golovka-torx-e10-1-4	5	\N	2025-10-14 10:16:36.08	2025-10-14 11:15:45.703	{"Дело техники":{"displayName":"Головка TORX E10 1/4\\"","imagePath":"/img/products/603010/603010_1760440514859_1.jpg","productCode":"603010","updatedAt":"2025-10-14T11:15:45.701Z"}}
3	Ключ накидной Е-профиль Е10хЕ12	klyuch-nakidnoy-e-profil-e10he12	7	\N	2025-10-14 11:30:27.9	2025-10-14 11:32:00.96	{"Дело техники":{"displayName":"Ключ накидной TORX Е10×Е12","imagePath":"/img/products/514412/514412_1760441496965_1.jpg","productCode":"514412","updatedAt":"2025-10-14T11:32:00.959Z"}}
4	Головка 30мм (12гр.), 1/2''	golovka-30mm-12gr-1-2	8	\N	2025-10-14 11:37:11.202	2025-10-14 11:38:45.145	{"Дело техники":{"displayName":"Головка двенадцатигранная 30мм 1/2\\"","imagePath":"/img/products/622030/622030_1760441908955_1.jpg","productCode":"622030","updatedAt":"2025-10-14T11:38:45.144Z"}}
5	Подставка ремонтная 2т	podstavka-remontnaya-2t	11	\N	2025-10-14 11:43:24.821	2025-10-14 11:45:59.704	{"JCB":{"displayName":"Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт","imagePath":"/img/products/JCB-TH52002C/JCB-TH52002C_1760442274730_1.jpg","productCode":"JCB-TH52002C","updatedAt":"2025-10-14T11:45:59.703Z"}}
6	Съемник рулевых тяг универсальный 27-42мм, 1/2''	s-emnik-rulevyh-tyag-universal-nyy-27-42mm-1-2	15	\N	2025-10-14 11:53:42.745	2025-10-14 12:01:13.757	{"RockFORCE":{"displayName":"Съемник рулевых тяг универсальный 27-42мм, 1/2''","imagePath":"/img/products/RF-9T0801/RF-9T0801_1760443265093_1.jpg","productCode":"RF-9T0801","updatedAt":"2025-10-14T12:01:13.756Z"}}
7	Сверло ступенчатое HSS 4241(4-32мм)	sverlo-stupenchatoe-hss-4241-4-32mm	18	\N	2025-10-14 12:06:25.903	2025-10-14 12:07:53.527	{"Partner":{"displayName":"Сверло ступенчатое HSS 4241(4-32мм), в блистере","imagePath":"/img/products/PA-44740/PA-44740_1760443667328_1.jpg","productCode":"PA-44740","updatedAt":"2025-10-14T12:07:53.526Z"}}
8	Ключ комбинированный трещоточный 13мм	klyuch-kombinirovannyy-treschotochnyy-13mm	20	\N	2025-10-14 12:11:25.113	2025-10-14 12:12:41.367	{"RockFORCE":{"displayName":"Ключ комбинированный трещоточный 13мм","imagePath":"/img/products/RF-75713/RF-75713_1760443947997_1.jpg","productCode":"RF-75713","updatedAt":"2025-10-14T12:12:41.366Z"}}
9	Бита 6-гранная H5х75ммL,10мм	bita-6-grannaya-h5h75mml-10mm	22	\N	2025-10-14 12:15:49.721	2025-10-14 12:17:13.436	{"RockFORCE":{"displayName":"Бита 6-гранная H5х75ммL,10мм","imagePath":"/img/products/RF-1747505 Premium/RF-1747505 Premium_1760444227594_1.jpg","productCode":"RF-1747505 Premium","updatedAt":"2025-10-14T12:17:13.435Z"}}
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name) FROM stdin;
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 6, true);


--
-- Name: cash_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_days_id_seq', 1, true);


--
-- Name: cash_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_events_id_seq', 11, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 22, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disassembly_scenarios_id_seq', 1, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 11, true);


--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_unit_logs_id_seq', 171, true);


--
-- Name: product_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_units_id_seq', 46, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 11, true);


--
-- Name: spines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spines_id_seq', 9, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: cash_days cash_days_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_days
    ADD CONSTRAINT cash_days_pkey PRIMARY KEY (id);


--
-- Name: cash_events cash_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events
    ADD CONSTRAINT cash_events_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: disassembly_scenarios disassembly_scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disassembly_scenarios
    ADD CONSTRAINT disassembly_scenarios_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_unit_logs product_unit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_unit_logs
    ADD CONSTRAINT product_unit_logs_pkey PRIMARY KEY (id);


--
-- Name: product_units product_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT product_units_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: spines spines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spines
    ADD CONSTRAINT spines_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: brands_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_name_key ON public.brands USING btree (name);


--
-- Name: brands_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_slug_key ON public.brands USING btree (slug);


--
-- Name: cash_days_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cash_days_date_key ON public.cash_days USING btree (date);


--
-- Name: categories_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_path_idx ON public.categories USING btree (path);


--
-- Name: categories_path_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_path_key ON public.categories USING btree (path);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: disassembly_scenarios_parentProductCode_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "disassembly_scenarios_parentProductCode_name_key" ON public.disassembly_scenarios USING btree ("parentProductCode", name);


--
-- Name: product_units_serial_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_units_serial_number_key ON public.product_units USING btree (serial_number);


--
-- Name: products_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);


--
-- Name: spines_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX spines_slug_key ON public.spines USING btree (slug);


--
-- Name: suppliers_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX suppliers_name_key ON public.suppliers USING btree (name);


--
-- Name: cash_events cash_events_cash_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events
    ADD CONSTRAINT cash_events_cash_day_id_fkey FOREIGN KEY (cash_day_id) REFERENCES public.cash_days(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cash_events cash_events_product_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events
    ADD CONSTRAINT cash_events_product_unit_id_fkey FOREIGN KEY (product_unit_id) REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: product_unit_logs product_unit_logs_productUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_unit_logs
    ADD CONSTRAINT "product_unit_logs_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_units product_units_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_disassembledParentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_disassembledParentId_fkey" FOREIGN KEY ("disassembledParentId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_disassemblyScenarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_disassemblyScenarioId_fkey" FOREIGN KEY ("disassemblyScenarioId") REFERENCES public.disassembly_scenarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_parentProductUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_parentProductUnitId_fkey" FOREIGN KEY ("parentProductUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_units product_units_spineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_spineId_fkey" FOREIGN KEY ("spineId") REFERENCES public.spines(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_spineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_spineId_fkey" FOREIGN KEY ("spineId") REFERENCES public.spines(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: spines spines_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spines
    ADD CONSTRAINT "spines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

