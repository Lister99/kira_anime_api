import _ from 'lodash'
import { ToolKit } from './utils'

interface ServerOptions {
  remote: string
  slug: string
  server: string
  lang: number
}

export interface EpisodeServers {
  server: string;
  url: string;
}

function transformURL(servers: ServerOptions[]): EpisodeServers[] {
  return _.map(servers, serverOption => {
    const url = `https://jkanime.net/c1.php?${ToolKit.buildQuery({ u: serverOption.remote, s: _.toLower(serverOption.server) })}`.replace('c1.php', 'jkplayer/c1')
    return {
      server: serverOption.server,
      url,
    }
  })
}

async function getRemoteServerOptions(servers: ServerOptions[]) {
  return transformURL(servers)
}

export default getRemoteServerOptions
